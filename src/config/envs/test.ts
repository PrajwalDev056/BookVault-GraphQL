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
    env: 'test',
    port: parseInt(process.env.PORT || '3000', 10),
    debug: true,
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        name: process.env.MONGODB_DB_NAME || 'bookvault_test',
        options: {
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 10000,
            maxPoolSize: 10,
            retryWrites: true,
        },
    },
    cors: {
        allowedOrigins: ['http://localhost:4200'],
    },
    security: {
        csrfSecret: 'test-csrf-secret',
        jsonLimit: '100kb',
    },
    throttle: {
        ttl: 60,
        limit: 100,
    },
    logging: {
        level: 'debug',
    },
});
