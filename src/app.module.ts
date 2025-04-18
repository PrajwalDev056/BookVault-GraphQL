import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthorsModule } from './authors/authors.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { RentalsModule } from './rentals/rentals.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    AppConfigModule,

    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.database.uri,
        dbName: configService.database.name,
        ...configService.database.options,
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log(`MongoDB connection established to ${configService.database.name}`);
          });
          connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
          });
          connection.on('disconnected', () => {
            console.log('MongoDB connection disconnected');
          });
          return connection;
        },
      }),
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      driver: ApolloDriver,
      useFactory: (configService: AppConfigService) => ({
        driver: ApolloDriver,
        playground: false, // Disable GraphQL Playground in production
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        introspection: !configService.isProduction,
        plugins: configService.isDevelopment
          ? [ApolloServerPluginLandingPageLocalDefault()]
          : [],
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
export class AppModule { }
