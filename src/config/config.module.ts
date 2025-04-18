import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './validation.schema';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            validationSchema,
            validationOptions: {
                allowUnknown: true,
                abortEarly: false,
            },
        }),
    ],
})
export class AppConfigModule { }