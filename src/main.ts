import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);

  app.use(json({ limit: configService.security.jsonLimit }));

  // Helmet is applied before CORS to ensure security headers are set without conflicts
  app.use(helmet({
    contentSecurityPolicy: configService.isProduction ? undefined : false,
  }));

  // Configure CORS with restrictive settings
  app.enableCors({
    origin: configService.cors.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });

  // Configure CSRF protection
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

  await app.listen(configService.port);
  console.log(`Application is running on: http://localhost:${configService.port}`);
}
bootstrap();
