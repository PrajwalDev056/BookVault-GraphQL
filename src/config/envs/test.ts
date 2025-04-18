export default () => ({
  env: 'test',
  port: parseInt(process.env.PORT, 10) || 3001,
  
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    name: process.env.MONGODB_DB_NAME || 'graphQL_test',
  },

  cors: {
    allowedOrigins: ['http://localhost:4200'],
  },

  security: {
    csrfSecret: process.env.CSRF_SECRET || 'test-secret',
    jsonLimit: '10mb',
  },

  throttle: {
    ttl: 60000,
    limit: 100, // Higher limit for tests
  },
  
  // Test-specific settings
  debug: true,
  logging: {
    level: 'warn',
  },
});