import { GraphQLError } from 'graphql';

/**
 * Custom GraphQL error codes
 */
export enum ErrorCode {
    // Authentication / Authorization Errors
    unauthenticated = 'UNAUTHENTICATED',
    unauthorizedAccess = 'UNAUTHORIZED',

    // Resource Errors
    notFound = 'NOT_FOUND',
    alreadyExists = 'ALREADY_EXISTS',

    // Input Errors
    badUserInput = 'BAD_USER_INPUT',
    validationError = 'VALIDATION_ERROR',

    // Business Logic Errors
    businessRuleViolation = 'BUSINESS_RULE_VIOLATION',

    // System Errors
    internalServerError = 'INTERNAL_SERVER_ERROR',
    databaseError = 'DATABASE_ERROR',
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
        super(message, ErrorCode.unauthenticated, { statusCode: 401 });
    }
}

/**
 * Authorization error when user doesn't have required permissions
 */
export class AuthorizationError extends BaseGraphQLError {
    constructor(message = 'Not authorized') {
        super(message, ErrorCode.unauthorizedAccess, { statusCode: 403 });
    }
}

/**
 * Error thrown when a requested resource is not found
 */
export class NotFoundError extends BaseGraphQLError {
    constructor(message = 'Resource not found') {
        super(message, ErrorCode.notFound, { statusCode: 404 });
    }
}

/**
 * Error thrown when attempting to create a resource that already exists
 */
export class ResourceAlreadyExistsError extends BaseGraphQLError {
    constructor(message = 'Resource already exists') {
        super(message, ErrorCode.alreadyExists, { statusCode: 409 });
    }
}

/**
 * Error for invalid user input
 */
export class UserInputError extends BaseGraphQLError {
    constructor(message: string, validationErrors?: Record<string, string>[]) {
        super(message, ErrorCode.badUserInput, {
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
        super(message, ErrorCode.businessRuleViolation, { statusCode: 422 });
    }
}

/**
 * Error thrown when a database operation fails
 */
export class DatabaseError extends BaseGraphQLError {
    constructor(message = 'Database operation failed', originalError?: Error) {
        super(message, ErrorCode.databaseError, {
            statusCode: 500,
            originalError,
        });
    }
}

/**
 * Formats errors for Apollo Server, ensuring all errors conform to a consistent GraphQL error structure.
 *
 * Returns the provided formatted error if it is already a recognized GraphQL error; otherwise, wraps unexpected errors in a {@link BaseGraphQLError} with a generic message and status code 500.
 *
 * @param formattedError - The error as formatted by Apollo Server.
 * @param error - The original error thrown during execution.
 * @returns A GraphQL-compliant error object suitable for client responses.
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
    return new BaseGraphQLError('An unexpected error occurred', ErrorCode.internalServerError, {
        statusCode: 500,
        originalError,
    });
}
