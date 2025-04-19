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
    env: 'production',
    port: parseInt(process.env.PORT || '3000', 10),
    debug: false,
    database: {
        uri: process.env.MONGODB_URI,
        name: process.env.MONGODB_DB_NAME || 'bookvault_prod',
        options: {
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 10000,
            maxPoolSize: 100,
            retryWrites: true,
        },
    },
    cors: {
        allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(','),
    },
    security: {
        csrfSecret: process.env.CSRF_SECRET,
        jsonLimit: process.env.JSON_LIMIT || '50kb',
    },
    throttle: {
        ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || '30', 10),
    },
    logging: {
        level: 'error',
    },
});
