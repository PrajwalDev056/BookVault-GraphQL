import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { doubleCsrf } from 'csrf-csrf';
import { json } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap(): Promise<void> {
    // Create environment-aware logger
    const logger = new Logger('Bootstrap');

    // Log the current environment to assist with debugging
    logger.log(`Starting application in ${process.env.NODE_ENV || 'development'} mode`);

    const app = await NestFactory.create(AppModule, {
        // Only show error logs in production, show all logs in other environments
        logger:
            process.env.NODE_ENV === 'production'
                ? ['error', 'warn']
                : ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    const configService = app.get(AppConfigService);

    logger.log(`Environment: ${configService.nodeEnv}`);

    app.use(json({ limit: configService.security.jsonLimit }));

    // Configure Helmet with Apollo Server v4 compatible settings
    app.use(
        helmet({
            contentSecurityPolicy: configService.isProduction
                ? {
                      directives: {
                          defaultSrc: ["'self'"],
                          baseUri: ["'self'"],
                          fontSrc: ["'self'", 'https:', 'data:'],
                          frameAncestors: ["'self'"],
                          imgSrc: ["'self'", 'data:', 'https:'],
                          objectSrc: ["'none'"],
                          scriptSrc: [
                              "'self'",
                              "'unsafe-inline'",
                              "'unsafe-eval'",
                              'https://apollo-server-landing-page.cdn.apollographql.com',
                          ],
                          scriptSrcAttr: ["'none'"],
                          styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
                          // Allow Apollo Explorer to load
                          connectSrc: ["'self'", 'https://explorer.api.apollographql.com'],
                          upgradeInsecureRequests: [],
                      },
                  }
                : false,
            crossOriginEmbedderPolicy: false, // Required for Apollo Explorer to work properly
        }),
    );

    // Configure CORS with settings compatible with Apollo Server v4
    app.enableCors({
        origin: configService.cors.allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-CSRF-Token',
            'Apollo-Require-Preflight',
        ],
    });

    // Configure CSRF protection with environment-aware settings
    const { doubleCsrfProtection, generateToken } = doubleCsrf({
        getSecret: () => configService.security.csrfSecret,
        cookieName: 'x-csrf-token',
        cookieOptions: {
            httpOnly: true,
            sameSite: 'strict',
            secure: configService.isProduction,
            path: '/',
        },
        size: 64,
        getTokenFromRequest: req => req.get('x-csrf-token'),
    });

    // Apply CSRF middleware with exclusion for GraphQL paths
    app.use((req, res, next) => {
        // Skip CSRF protection for GraphQL endpoints
        if (req.path === '/graphql') {
            return next();
        }

        // Apply CSRF protection to all other routes
        return doubleCsrfProtection(req, res, next);
    });

    // Provide a route to get CSRF token for non-GraphQL routes
    app.use('/csrf-token', (req, res) => {
        const token = generateToken(req, res);
        return res.json({ token });
    });

    // Start server with configuration from current environment
    await app.listen(configService.port);

    logger.log(`Application is running on: http://localhost:${configService.port}`);

    if (configService.debug) {
        logger.debug('Debug mode is enabled');
    }
}

bootstrap().catch(err => {
    // Use the NestJS Logger instead of console.error
    const logger = new Logger('Bootstrap');
    logger.error(`Error during application bootstrap: ${err}`);
    process.exit(1);
});
