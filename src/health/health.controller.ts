import { Controller, Get } from '@nestjs/common';

import { DatabaseHealthIndicator } from './database.health';

interface DatabaseHealthStatus {
    status: string;
    details?: Record<string, unknown>;
}

interface HealthCheckResponse {
    status: string;
    timestamp: string;
    services: { database: DatabaseHealthStatus };
}

@Controller('health')
export class HealthController {
    constructor(private readonly databaseHealthIndicator: DatabaseHealthIndicator) {}

    @Get()
    async healthCheck(): Promise<HealthCheckResponse> {
        const dbHealth = await this.databaseHealthIndicator.isHealthy('database');

        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            services: {
                database: {
                    status: dbHealth.database.status,
                    details: dbHealth.database.details,
                },
            },
        };
    }

    @Get('database')
    async databaseHealth(): Promise<DatabaseHealthStatus> {
        const result = await this.databaseHealthIndicator.isHealthy('database');
        return {
            status: result.database.status,
            details: result.database.details,
        };
    }
}
