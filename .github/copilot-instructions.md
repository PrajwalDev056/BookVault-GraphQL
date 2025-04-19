# GitHub Copilot Instructions for BookVault NestJS GraphQL API

## Project Architecture

This project is a NestJS GraphQL API designed for book rental management, integrating with MongoDB. It
adopts a domain-driven structure, organizing the codebase into distinct modules for authors, books,
users, and rentals to promote separation of concerns and maintainability.

## TypeScript Conventions

- Use strict typing with explicit return types
- Prefer interfaces over types for object shapes
- Use proper TypeScript decorators for NestJS and GraphQL
- Follow camelCase for methods and properties, PascalCase for classes and interfaces, and
  UPPER_SNAKE_CASE for constants. Ensure no line exceeds 100 characters.

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

## Markdown Linting

- Follow [markdownlint rules](https://github.com/markdownlint/markdownlint/blob/main/docs/RULES.md)
  to ensure consistent and readable markdown files. Keep each line under 100 characters.
- Use proper heading levels, bullet points, and code block formatting.
- Avoid trailing spaces and ensure line length does not exceed recommended limits.
- Include a blank line before and after headings and lists.
- Use fenced code blocks for code snippets.
