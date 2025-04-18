import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';

/**
 * Custom GraphQL error codes for consistent error handling
 */
export enum ErrorCode {
  // Authentication errors
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  UNAUTHORIZED = 'UNAUTHORIZED',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',

  // Input errors
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Business logic errors
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',

  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

/**
 * Base class for all GraphQL errors in the application
 * Compatible with Apollo Server v4 error handling
 */
export class AppGraphQLError extends GraphQLError {
  constructor(
    message: string,
    code: string = ErrorCode.INTERNAL_SERVER_ERROR,
    additionalProperties: Record<string, any> = {},
  ) {
    super(message, {
      extensions: {
        code,
        ...additionalProperties,
      },
    });

    Object.defineProperty(this, 'name', { value: 'AppGraphQLError' });
  }
}

/**
 * Error thrown when a requested resource is not found
 */
export class NotFoundError extends AppGraphQLError {
  constructor(resource: string, id?: string | number) {
    const idMessage = id ? ` with ID '${id}'` : '';
    super(`${resource}${idMessage} not found`, ErrorCode.NOT_FOUND, { resource, id });

    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}

/**
 * Error thrown when authentication is required but not provided or is invalid
 */
export class AuthenticationError extends AppGraphQLError {
  constructor(message = 'Authentication required') {
    super(message, ErrorCode.UNAUTHENTICATED);

    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}

/**
 * Error thrown when a user is authenticated but not authorized to perform an action
 */
export class AuthorizationError extends AppGraphQLError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, ErrorCode.UNAUTHORIZED);

    Object.defineProperty(this, 'name', { value: 'AuthorizationError' });
  }
}

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends AppGraphQLError {
  constructor(message: string, validationErrors: Record<string, any> = {}) {
    super(message, ErrorCode.VALIDATION_ERROR, { validationErrors });

    Object.defineProperty(this, 'name', { value: 'ValidationError' });
  }
}

/**
 * Error thrown when an entity already exists (e.g., duplicate key)
 */
export class ConflictError extends AppGraphQLError {
  constructor(resource: string, field: string, value: any) {
    super(`${resource} with ${field} '${value}' already exists`, ErrorCode.ALREADY_EXISTS, {
      resource,
      field,
      value,
    });

    Object.defineProperty(this, 'name', { value: 'ConflictError' });
  }
}

/**
 * Error thrown when a business rule is violated
 */
export class BusinessRuleViolationError extends AppGraphQLError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, ErrorCode.BUSINESS_RULE_VIOLATION, { details });

    Object.defineProperty(this, 'name', { value: 'BusinessRuleViolationError' });
  }
}

/**
 * Format error for Apollo Server v4 to prevent leaking sensitive information
 */
export const formatError = (error: GraphQLError, isDevelopment = false): GraphQLError => {
  const originalError = error.originalError;

  // Don't mask Apollo's own errors
  if (
    error.extensions?.code === ApolloServerErrorCode.GRAPHQL_PARSE_FAILED ||
    error.extensions?.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED ||
    error.extensions?.code === ApolloServerErrorCode.BAD_USER_INPUT
  ) {
    return error;
  }

  // If it's already our custom error, return it as is
  if (
    originalError instanceof AppGraphQLError ||
    Object.values(ErrorCode).includes(error.extensions?.code as ErrorCode)
  ) {
    return error;
  }

  // In development, return the original error for debugging
  if (isDevelopment) {
    return error;
  }

  // In production, mask internal errors
  return new GraphQLError('Internal server error', {
    extensions: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
    },
  });
};
