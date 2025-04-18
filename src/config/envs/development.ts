export default () => ({
  env: 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    name: process.env.MONGODB_DB_NAME || 'graphQL',
  },

  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4200'],
  },

  security: {
    csrfSecret: process.env.CSRF_SECRET,
    jsonLimit: process.env.JSON_LIMIT || '50mb',
  },

  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60000,
    limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 10,
  },
  
  // Development-specific settings
  debug: true,
  logging: {
    level: 'debug',
  },
});