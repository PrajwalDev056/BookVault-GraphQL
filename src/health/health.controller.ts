import { Controller, Get } from '@nestjs/common';
import { DatabaseHealthService } from './database.health';

@Controller('health')
export class HealthController {
  constructor(private readonly databaseHealthService: DatabaseHealthService) {}

  @Get()
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: await this.databaseHealthService.check(),
      }
    };
  }

  @Get('database')
  async databaseHealth() {
    return this.databaseHealthService.check();
  }
}