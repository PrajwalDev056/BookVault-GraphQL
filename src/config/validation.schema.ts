import * as Joi from 'joi';

export const validationSchema = Joi.object({
    // Node environment
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),

    // MongoDB connection
    MONGODB_URI: Joi.string().default('mongodb://localhost:27017'),
    MONGODB_DB_NAME: Joi.string().default('graphQL'),

    // CORS settings
    ALLOWED_ORIGINS: Joi.string().default('http://localhost:4200'),

    // Security settings
    CSRF_SECRET: Joi.string().required(),
    JSON_LIMIT: Joi.string().default('50mb'),

    // Rate limiting
    THROTTLE_TTL: Joi.number().default(60000),
    THROTTLE_LIMIT: Joi.number().default(10),
});