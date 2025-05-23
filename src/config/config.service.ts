import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Interface for database configuration options
 */
interface DatabaseOptions {
    serverSelectionTimeoutMS: number;
    heartbeatFrequencyMS: number;
    maxPoolSize: number;
    retryWrites: boolean;
    [key: string]: unknown;
}

/**
 * Interface for database configuration
 */
interface DatabaseConfig {
    uri: string;
    name: string;
    options: DatabaseOptions;
}

/**
 * Interface for CORS configuration
 */
interface CorsConfig {
    allowedOrigins: string[];
}

/**
 * Interface for security configuration
 */
interface SecurityConfig {
    csrfSecret: string;
    jsonLimit: string;
}

/**
 * Interface for throttling configuration
 */
interface ThrottlingConfig {
    ttl: number;
    limit: number;
}

/**
 * Interface for logging configuration
 */
interface LoggingConfig {
    level: string;
}

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
                throw new Error(
                    `Invalid MongoDB connection string: ${uri}. Must start with mongodb:// or mongodb+srv://`,
                );
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

    get database(): DatabaseConfig {
        return {
            uri: this.configService.get<string>('database.uri'),
            name: this.configService.get<string>('database.name'),
            options: this.configService.get<DatabaseOptions>('database.options') || {
                // Removed deprecated options: useNewUrlParser and useUnifiedTopology
                serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
                heartbeatFrequencyMS: 10000, // Check server health every 10 seconds
                maxPoolSize: 10, // Maximum number of sockets to keep in connection pool
                retryWrites: true, // Retry write operations on network errors
            },
        };
    }

    get cors(): CorsConfig {
        return {
            allowedOrigins: this.configService.get<string[]>('cors.allowedOrigins') || [],
        };
    }

    get security(): SecurityConfig {
        return {
            csrfSecret: this.configService.get<string>('security.csrfSecret'),
            jsonLimit: this.configService.get<string>('security.jsonLimit'),
        };
    }

    get throttling(): ThrottlingConfig {
        return {
            ttl: this.configService.get<number>('throttle.ttl'),
            limit: this.configService.get<number>('throttle.limit'),
        };
    }

    get debug(): boolean {
        return this.configService.get<boolean>('debug') || false;
    }

    get logging(): LoggingConfig {
        return {
            level: this.configService.get<string>('logging.level') || 'info',
        };
    }
}
