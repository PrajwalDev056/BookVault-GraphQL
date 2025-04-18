import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    private readonly logger = new Logger(AppConfigService.name);

    constructor(private configService: ConfigService) {
        // Validate database config on service initialization
        this.validateDatabaseConfig();
    }

    private validateDatabaseConfig(): void {
        const uri = this.database.uri;
        const dbName = this.database.name;

        if (!uri) {
            this.logger.error('MongoDB URI is not defined in environment variables');
            throw new Error('MongoDB URI is required for application startup');
        }

        if (!dbName) {
            this.logger.error('MongoDB database name is not defined in environment variables');
            throw new Error('MongoDB database name is required for application startup');
        }

        try {
            // Basic validation of MongoDB URI format
            const mongoUrlPattern = /^mongodb(\+srv)?:\/\//;
            if (!mongoUrlPattern.test(uri)) {
                throw new Error(`Invalid MongoDB connection string: ${uri}. Must start with mongodb:// or mongodb+srv://`);
            }

            this.logger.log('Database configuration validated successfully');
        } catch (error) {
            this.logger.error(`Database configuration validation failed: ${error.message}`);
            throw error;
        }
    }

    get nodeEnv(): string {
        return this.configService.get<string>('env');
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    get isDevelopment(): boolean {
        return this.nodeEnv === 'development';
    }

    get isTest(): boolean {
        return this.nodeEnv === 'test';
    }

    get port(): number {
        return this.configService.get<number>('port') ?? 3000;
    }

    get database() {
        return {
            uri: this.configService.get<string>('database.uri'),
            name: this.configService.get<string>('database.name'),
            options: this.configService.get<Record<string, any>>('database.options') || {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
                heartbeatFrequencyMS: 10000, // Check server health every 10 seconds
                maxPoolSize: 10, // Maximum number of sockets to keep in connection pool
                retryWrites: true, // Retry write operations on network errors
            }
        };
    }

    get cors() {
        return {
            allowedOrigins: this.configService.get<string[]>('cors.allowedOrigins') || [],
        };
    }

    get security() {
        return {
            csrfSecret: this.configService.get<string>('security.csrfSecret'),
            jsonLimit: this.configService.get<string>('security.jsonLimit'),
        };
    }

    get throttling() {
        return {
            ttl: this.configService.get<number>('throttle.ttl'),
            limit: this.configService.get<number>('throttle.limit'),
        };
    }

    get debug(): boolean {
        return this.configService.get<boolean>('debug') || false;
    }

    get logging() {
        return {
            level: this.configService.get<string>('logging.level') || 'info',
        };
    }
}