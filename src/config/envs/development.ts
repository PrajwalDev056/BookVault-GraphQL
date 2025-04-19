export default (): {
    env: string;
    port: number;
    debug: boolean;
    database: {
        uri: string;
        name: string;
        options: {
            serverSelectionTimeoutMS: number;
            heartbeatFrequencyMS: number;
            maxPoolSize: number;
            retryWrites: boolean;
        };
    };
    cors: {
        allowedOrigins: string[];
    };
    security: {
        csrfSecret: string;
        jsonLimit: string;
    };
    throttle: {
        ttl: number;
        limit: number;
    };
    logging: {
        level: string;
    };
} => ({
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    debug: true,
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        name: process.env.MONGODB_DB_NAME || 'bookvault_dev',
        options: {
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 10000,
            maxPoolSize: 10,
            retryWrites: true,
        },
    },
    cors: {
        allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:4200').split(','),
    },
    security: {
        csrfSecret: process.env.CSRF_SECRET || 'development-csrf-secret',
        jsonLimit: process.env.JSON_LIMIT || '100kb',
    },
    throttle: {
        ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    },
    logging: {
        level: 'debug',
    },
});
