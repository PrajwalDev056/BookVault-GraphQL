# Environment Configuration Guide

This document describes how environment variables are handled in the NestJS GraphQL application.

## Configuration Structure

The app uses a hierarchical configuration system with:

1. **Environment-specific configuration files**:
   - `development.ts` - Development environment settings
   - `production.ts` - Production environment settings
   - `test.ts` - Testing environment settings

2. **Environment variable templates**:
   - `.env.example` - Base template with all supported variables
   - `.env.development.example` - Development-specific template
   - `.env.production.example` - Production-specific template
   - `.env.test.example` - Test-specific template

## Required Environment Variables

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `NODE_ENV` | Application environment | `development` |
| `PORT` | HTTP server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` (dev) |
| `MONGODB_DB_NAME` | MongoDB database name | `graphQL` (dev) |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:4200` |
| `CSRF_SECRET` | Secret for CSRF protection | None (required) |
| `JSON_LIMIT` | Max JSON payload size | `50mb` (dev), `15mb` (prod) |
| `THROTTLE_TTL` | Rate limiting window in milliseconds | `60000` |
| `THROTTLE_LIMIT` | Max requests in window | `10` (dev), `20` (prod) |

## Environment Setup

### Development

1. Copy `.env.development.example` to `.env.development`
2. Update values as needed
3. Run the application with `NODE_ENV=development npm run start:dev`

### Production

1. Copy `.env.production.example` to `.env.production`
2. Update values with secure production settings
3. Run the application with `NODE_ENV=production npm run start:prod`

### Testing

1. Copy `.env.test.example` to `.env.test`
2. Update values as needed
3. Run tests with `NODE_ENV=test npm run test`

## Configuration Access

Access configuration values through the `AppConfigService`:

```typescript
// Inject the service
constructor(private readonly configService: AppConfigService) {}

// Access configuration properties
const dbUri = this.configService.database.uri;
const isProduction = this.configService.isProduction;
```

## Adding New Configuration

1. Add the variable to the appropriate environment file in `src/config/envs/`
2. Add validation in `src/config/validation.schema.ts`
3. Add accessor in `src/config/config.service.ts`
4. Update example files and documentation