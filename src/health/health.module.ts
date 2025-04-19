import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseHealthIndicator } from './database.health';
import { HealthController } from './health.controller';

@Module({
    imports: [MongooseModule],
    providers: [DatabaseHealthIndicator],
    controllers: [HealthController],
    exports: [DatabaseHealthIndicator],
})
export class HealthModule {}
