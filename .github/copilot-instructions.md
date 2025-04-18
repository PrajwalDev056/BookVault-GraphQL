# GitHub Copilot Instructions for BookVault NestJS GraphQL API

## Project Architecture

This is a NestJS GraphQL API for book rental management with MongoDB integration. The project follows a domain-driven structure with separate modules for authors, books, users, and rentals.

## TypeScript Conventions

- Use strict typing with explicit return types
- Prefer interfaces over types for object shapes
- Use proper TypeScript decorators for NestJS and GraphQL
- Follow camelCase for methods/properties, PascalCase for classes/interfaces

## NestJS & GraphQL Guidelines

- Follow code-first approach for GraphQL schemas
- Maintain resolver-service separation of concerns
- Use dependency injection through constructor parameters
- Implement proper error handling with custom exceptions

## Database Patterns

- Use Mongoose schemas with TypeScript interfaces
- Implement proper validation in schema definitions
- Structure queries for optimal MongoDB performance
- Use repository pattern for data access abstraction

## Testing Approach

- Write unit tests for services with mocked dependencies
- Test GraphQL resolvers separately from services
- Create E2E tests for critical API paths

## Configuration Management

- Use environment-specific configuration files
- Validate environment variables with Joi schema
- Access configuration through AppConfigService
