import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigService } from './config.service';
import developmentConfig from './envs/development';
import productionConfig from './envs/production';
import testConfig from './envs/test';
import { validationSchema } from './validation.schema';

/**
 * Configuration module that loads environment-specific configuration
 * based on NODE_ENV and validates environment variables
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
      load: [
        process.env.NODE_ENV === 'production'
          ? productionConfig
          : process.env.NODE_ENV === 'test'
            ? testConfig
            : developmentConfig,
      ],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      cache: true,
      expandVariables: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
