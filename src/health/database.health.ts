import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
    constructor(@InjectConnection() private readonly connection: Connection) {
        super();
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        try {
            // Check if connection is established
            if (this.connection.readyState !== 1) {
                throw new Error('MongoDB connection is not established');
            }

            // Get connection metrics
            const connectionStats: Record<string, unknown> = {
                readyState: this.connection.readyState,
                host: this.connection.host,
                port: this.connection.port,
                name: this.connection.name,
            };

            return this.getStatus(key, true, connectionStats);
        } catch (error) {
            throw new HealthCheckError(
                'DatabaseHealthCheck failed',
                this.getStatus(key, false, { message: error.message }),
            );
        }
    }
}
