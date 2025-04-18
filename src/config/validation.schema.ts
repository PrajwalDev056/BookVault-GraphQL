import * as Joi from 'joi';

export const validationSchema = Joi.object({
    // Node environment
    nodeEnv: Joi.string()
        .valid('development', 'production', 'test')
        .default('development')
        .description('Application environment')
        .label('NODE_ENV'),
    port: Joi.number().default(3000).description('Application port').label('PORT'),

    // MongoDB connection
    mongodbUri: Joi.string()
        .uri({
            scheme: ['mongodb', 'mongodb+srv'],
        })
        .regex(
            /^mongodb(\+srv)?:\/\/(?:(?:[^:]+):(?:[^@]+)@)?(?:(?:[^:]+)|\[(?:[^\]]+)\])(?::(?:\d+))?(?:\/(?:[^?]+))?(?:\?(?:.+=.+)(?:&.+=.+)*)?$/,
        )
        .message('MONGODB_URI must be a valid MongoDB connection string')
        .required()
        .description(
            'MongoDB connection string in the format mongodb://[username:password@]host[:port][/database][?options]',
        )
        .label('MONGODB_URI'),
    mongodbDbName: Joi.string()
        .required()
        .description('MongoDB database name')
        .label('MONGODB_DB_NAME'),

    // CORS settings
    allowedOrigins: Joi.string()
        .default('http://localhost:4200')
        .description('Allowed CORS origins')
        .label('ALLOWED_ORIGINS'),

    // Security settings
    csrfSecret: Joi.string().required().description('CSRF protection secret').label('CSRF_SECRET'),
    jsonLimit: Joi.string()
        .default('50mb')
        .description('JSON request size limit')
        .label('JSON_LIMIT'),

    // Rate limiting
    throttleTtl: Joi.number()
        .default(60000)
        .description('Throttling time-to-live in ms')
        .label('THROTTLE_TTL'),
    throttleLimit: Joi.number()
        .default(10)
        .description('Throttling request limit')
        .label('THROTTLE_LIMIT'),
}).unknown();
