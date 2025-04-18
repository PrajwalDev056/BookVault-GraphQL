import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';
import { AppConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Create environment-aware logger
  const logger = new Logger('Bootstrap');
  
  // Log the current environment to assist with debugging
  logger.log(`Starting application in ${process.env.NODE_ENV || 'development'} mode`);
  
  const app = await NestFactory.create(AppModule, {
    // Only show error logs in production, show all logs in other environments
    logger: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn'] 
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  const configService = app.get(AppConfigService);
  
  logger.log(`Environment: ${configService.nodeEnv}`);
  
  app.use(json({ limit: configService.security.jsonLimit }));

  // Helmet is applied before CORS to ensure security headers are set without conflicts
  app.use(helmet({
    contentSecurityPolicy: configService.isProduction ? undefined : false,
  }));

  // Configure CORS with restrictive settings based on environment
  app.enableCors({
    origin: configService.cors.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });

  // Configure CSRF protection with environment-aware settings
  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: () => configService.security.csrfSecret,
    cookieName: 'x-csrf-token',
    cookieOptions: {
      httpOnly: true,
      sameSite: 'strict',
      secure: configService.isProduction,
      path: '/',
    },
    size: 64,
    getTokenFromRequest: (req) => req.get('x-csrf-token'),
  });

  // Apply CSRF middleware
  app.use(doubleCsrfProtection);

  // Start server with configuration from current environment
  await app.listen(configService.port);
  
  logger.log(`Application is running on: http://localhost:${configService.port}`);
  
  if (configService.debug) {
    logger.debug('Debug mode is enabled');
  }
}

bootstrap().catch(err => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});
