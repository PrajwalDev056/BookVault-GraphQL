import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { formatError } from './common/errors/graphql-errors';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { HealthModule } from './health/health.module';
import { RentalsModule } from './rentals/rentals.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        AppConfigModule,

        MongooseModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: async (configService: AppConfigService) => ({
                uri: configService.database.uri,
                dbName: configService.database.name,
                connectionFactory: (
                    connection: import('mongoose').Connection,
                ): import('mongoose').Connection => {
                    connection.on('connected', () => {
                        import('@nestjs/common').then(({ Logger: logger }) => {
                            logger.log(
                                `MongoDB connection established to ${configService.database.name}`,
                                'MongooseModule',
                            );
                        });
                    });
                    connection.on('error', error => {
                        import('@nestjs/common').then(({ Logger: logger }) => {
                            logger.error(
                                `MongoDB connection error: ${error}`,
                                '',
                                'MongooseModule',
                            );
                        });
                    });
                    connection.on('disconnected', () => {
                        import('@nestjs/common').then(({ Logger: logger }) => {
                            logger.warn('MongoDB connection disconnected', 'MongooseModule');
                        });
                    });
                    return connection;
                },
            }),
        }),

        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            driver: ApolloDriver,
            useFactory: (configService: AppConfigService): ApolloDriverConfig => ({
                driver: ApolloDriver,
                autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
                sortSchema: true,
                introspection: true, // Always enable introspection for Apollo Explorer
                playground: false, // GraphQL Playground is deprecated in Apollo Server v4

                // Configuration for Apollo Server v4 landing page
                plugins: [
                    ApolloServerPluginLandingPageLocalDefault(), // Enable the default Apollo Explorer
                ],

                // Security settings
                csrfPrevention: false, // Disable Apollo's CSRF as we have our own implementation
                includeStacktraceInErrorResponses: !configService.isProduction,

                // Set proper error formatting
                formatError: (error: import('graphql').GraphQLError) =>
                    formatError(error, configService.isDevelopment),

                // Pass request context
                context: ({ req, res }): { req: Request; res: Response } => ({ req, res }),

                // Performance settings
                cache: 'bounded',
            }),
        }),

        ThrottlerModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (configService: AppConfigService) => ({
                throttlers: [
                    {
                        ttl: configService.throttling.ttl,
                        limit: configService.throttling.limit,
                    },
                ],
            }),
        }),

        AuthorsModule,
        BooksModule,
        UsersModule,
        RentalsModule,
        HealthModule,
    ],
    controllers: [AppController],
    providers: [AppService, AppConfigService],
    exports: [AppConfigService],
})
export class AppModule {}
