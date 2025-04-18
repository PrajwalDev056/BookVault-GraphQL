import { GraphQLError } from 'graphql';

/**
 * Custom GraphQL error codes
 */
export enum ErrorCode {
    // Authentication / Authorization Errors
    UNAUTHENTICATED = 'UNAUTHENTICATED',
    UNAUTHORIZED = 'UNAUTHORIZED',

    // Resource Errors
    NOT_FOUND = 'NOT_FOUND',
    ALREADY_EXISTS = 'ALREADY_EXISTS',

    // Input Errors
    BAD_USER_INPUT = 'BAD_USER_INPUT',
    VALIDATION_ERROR = 'VALIDATION_ERROR',

    // Business Logic Errors
    BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',

    // System Errors
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
}

/**
 * Error extension data structure
 */
interface ErrorExtensions {
    code: ErrorCode;
    statusCode?: number;
    validationErrors?: Record<string, string>[];
    originalError?: Error;
    [key: string]: unknown;
}

/**
 * Base class for GraphQL errors with standardized formatting
 */
export class BaseGraphQLError extends GraphQLError {
    constructor(message: string, code: ErrorCode, extensions?: Omit<ErrorExtensions, 'code'>) {
        super(message, {
            extensions: {
                code,
                ...extensions,
            },
        });
    }
}

/**
 * Authentication error when user is not authenticated
 */
export class AuthenticationError extends BaseGraphQLError {
    constructor(message = 'Not authenticated') {
        super(message, ErrorCode.UNAUTHENTICATED, { statusCode: 401 });
    }
}

/**
 * Authorization error when user doesn't have required permissions
 */
export class AuthorizationError extends BaseGraphQLError {
    constructor(message = 'Not authorized') {
        super(message, ErrorCode.UNAUTHORIZED, { statusCode: 403 });
    }
}

/**
 * Error thrown when a requested resource is not found
 */
export class NotFoundError extends BaseGraphQLError {
    constructor(message = 'Resource not found') {
        super(message, ErrorCode.NOT_FOUND, { statusCode: 404 });
    }
}

/**
 * Error thrown when attempting to create a resource that already exists
 */
export class ResourceAlreadyExistsError extends BaseGraphQLError {
    constructor(message = 'Resource already exists') {
        super(message, ErrorCode.ALREADY_EXISTS, { statusCode: 409 });
    }
}

/**
 * Error for invalid user input
 */
export class UserInputError extends BaseGraphQLError {
    constructor(message: string, validationErrors?: Record<string, string>[]) {
        super(message, ErrorCode.BAD_USER_INPUT, {
            statusCode: 400,
            validationErrors,
        });
    }
}

/**
 * Error thrown when business rules are violated
 */
export class BusinessError extends BaseGraphQLError {
    constructor(message: string) {
        super(message, ErrorCode.BUSINESS_RULE_VIOLATION, { statusCode: 422 });
    }
}

/**
 * Error thrown when a database operation fails
 */
export class DatabaseError extends BaseGraphQLError {
    constructor(message = 'Database operation failed', originalError?: Error) {
        super(message, ErrorCode.DATABASE_ERROR, {
            statusCode: 500,
            originalError,
        });
    }
}

/**
 * Format error for Apollo Server
 */
export function formatError(formattedError: GraphQLError, error: unknown): GraphQLError {
    // If we already have a GraphQL error with proper formatting, return as is
    if (error instanceof BaseGraphQLError) {
        return formattedError;
    }

    // Handle standard GraphQL errors
    if (error instanceof GraphQLError) {
        return formattedError;
    }

    // Fallback for unexpected errors
    const originalError = error instanceof Error ? error : new Error(String(error));
    return new BaseGraphQLError('An unexpected error occurred', ErrorCode.INTERNAL_SERVER_ERROR, {
        statusCode: 500,
        originalError,
    });
}
