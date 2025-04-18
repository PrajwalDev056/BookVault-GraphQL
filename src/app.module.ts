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

@Module({
  imports: [
    AppConfigModule,

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017',
        dbName: configService.get<string>('MONGODB_DB_NAME') || 'graphQL',
      }),
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        driver: ApolloDriver,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        // Disable all plugins and related features
        plugins: [],
        introspection: false,
        playground: false, // Legacy option, but add it to be sure
      }),
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('THROTTLE_TTL') || 60000,
            limit: configService.get<number>('THROTTLE_LIMIT') || 10,
          },
        ],
      }),
    }),

    AuthorsModule,
    BooksModule,
    UsersModule,
    RentalsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
  exports: [AppConfigService],
})
export class AppModule { }
