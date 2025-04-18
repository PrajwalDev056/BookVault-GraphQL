import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseHealthService {
    private readonly logger = new Logger(DatabaseHealthService.name);

    constructor(@InjectConnection() private readonly connection: Connection) { }

    /**
     * Checks if the MongoDB connection is healthy
     * @returns {Promise<{status: string, details?: any}>} Health status and details
     */
    async check(): Promise<{ status: string, details?: any }> {
        try {
            if (this.connection.readyState === 1) {
                // Database status codes: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
                const adminDb = this.connection.db.admin();
                const serverStatus = await adminDb.serverStatus();

                return {
                    status: 'up',
                    details: {
                        uptime: serverStatus.uptime,
                        connections: serverStatus.connections,
                        version: serverStatus.version,
                        ok: serverStatus.ok === 1
                    }
                };
            } else {
                const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
                this.logger.warn(`Database connection not ready: ${states[this.connection.readyState]}`);

                return {
                    status: 'down',
                    details: {
                        state: states[this.connection.readyState]
                    }
                };
            }
        } catch (error) {
            this.logger.error(`Database health check failed: ${error.message}`, error.stack);
            return {
                status: 'down',
                details: {
                    error: error.message
                }
            };
        }
    }

    /**
     * Tests the MongoDB connection by performing a simple query
     * @returns {Promise<boolean>} Whether the connection test was successful
     */
    async testConnection(): Promise<boolean> {
        try {
            // Ping the database to test connectivity
            await this.connection.db.admin().ping();
            this.logger.log('Database connection test succeeded');
            return true;
        } catch (error) {
            this.logger.error(`Database connection test failed: ${error.message}`, error.stack);
            return false;
        }
    }
}