export default () => ({
    env: 'production',
    port: parseInt(process.env.PORT, 10) || 3000,

    database: {
        uri: process.env.MONGODB_URI,
        name: process.env.MONGODB_DB_NAME,
        options: {
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
        },
    },

    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
    },

    security: {
        csrfSecret: process.env.CSRF_SECRET,
        jsonLimit: process.env.JSON_LIMIT || '15mb',
    },

    throttle: {
        ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60000,
        limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 20,
    },

    // Production-specific settings
    debug: false,
    logging: {
        level: 'error',
    },
});