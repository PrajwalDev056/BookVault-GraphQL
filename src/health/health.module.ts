import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseHealthService } from './database.health';
import { HealthController } from './health.controller';

@Module({
    imports: [MongooseModule],
    providers: [DatabaseHealthService],
    controllers: [HealthController],
    exports: [DatabaseHealthService],
})
export class HealthModule { }