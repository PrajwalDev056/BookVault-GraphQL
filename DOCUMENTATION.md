# BookVault GraphQL API - Technical Documentation

## Project Overview

BookVault is a GraphQL-based API built with NestJS and MongoDB that provides a complete solution for book rental management. It implements a robust domain model with authors, books, users, and rental transactions, along with security features and configuration management.

## System Architecture

### Technology Stack

- **Backend Framework**: NestJS v11 (Node.js)
- **API Layer**: GraphQL with Apollo Server 4
- **Database**: MongoDB with Mongoose ODM
- **Configuration**: Environment-based configuration system
- **Security**: CSRF protection, Helmet, rate limiting, and CORS
- **Health Monitoring**: Custom health check endpoints

### Architecture Diagram

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  GraphQL API    │◄────►│  NestJS Modules │◄────►│    MongoDB      │
│  (Apollo Server)│      │  & Services     │      │  (Mongoose)     │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ▲                        ▲                        ▲
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Security Layer │      │  Configuration  │      │  Health Check   │
│  (CSRF, Helmet) │      │     System      │      │    Service      │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Domain Model

### Core Entities

The system is built around four main entities that form the core domain model:

1. **Author**: Represents book authors with their biographical information
2. **Book**: Represents books available in the system with their metadata
3. **User**: Represents system users who can rent books
4. **Rental**: Represents the transaction of a user borrowing and returning a book

### Entity Relationship Diagram

The ERD provided in the project (`book_rental_erd.png`) illustrates the relationships between these entities:

- **Authors ←→ Books**: One-to-many relationship (an author can write multiple books)
- **Books ←→ Rentals**: One-to-many relationship (a book can be rented multiple times)
- **Users ←→ Rentals**: One-to-many relationship (a user can have multiple rentals)

## Module Breakdown

### Authors Module

The Authors module provides functionality for managing author data:

- **Schema**: Defines the GraphQL schema for author data (name, bio, etc.)
- **Resolver**: Implements GraphQL resolvers for author queries and mutations
- **Service**: Business logic for author CRUD operations
- **Relationships**: Logic for retrieving books associated with authors

### Books Module

The Books module provides functionality for managing book inventory:

- **Schema**: Defines the GraphQL schema for book data (title, ISBN, etc.)
- **Resolver**: Implements GraphQL resolvers for book queries and mutations
- **Service**: Business logic for book CRUD operations
- **Relationships**: Logic for retrieving author information and rental history

### Users Module

The Users module provides user management capabilities:

- **Schema**: Defines the GraphQL schema for user data (name, email, etc.)
- **Resolver**: Implements GraphQL resolvers for user queries and mutations
- **Service**: Business logic for user CRUD operations
- **Relationships**: Logic for retrieving a user's rental history

### Rentals Module

The Rentals module handles the book checkout and return process:

- **Schema**: Defines the GraphQL schema for rental transactions
- **Resolver**: Implements GraphQL resolvers for rental queries and mutations
- **Service**: Business logic for creating and managing rentals
- **Validation**: Logic for validating rental eligibility and due dates

## Configuration System

An advanced environment-based configuration system has been implemented:

### Environment-Specific Configuration

- **Development Environment**: Settings optimized for local development
- **Production Environment**: Settings optimized for production deployment
- **Test Environment**: Settings optimized for automated testing

### Configuration Components

- **ConfigModule**: Central configuration module using NestJS ConfigModule
- **Environment Files**: Environment-specific configuration with appropriate defaults
- **Validation Schema**: Joi-based schema validation for environment variables
- **AppConfigService**: Strongly-typed access to configuration values

### Environment Variables

The system supports various configuration options including:

- Node environment settings
- Server port configuration
- MongoDB connection settings
- CORS configuration
- Security settings (CSRF, JSON limits)
- Rate limiting configuration

## Security Features

The application implements several security best practices:

### CSRF Protection

- Uses double-submit cookie pattern with csrf-csrf library
- Configurable secret key and cookie settings
- Environment-specific security levels

### Helmet Security Headers

- Implements Helmet middleware for HTTP security headers
- Content Security Policy configurable by environment
- Protection against common web vulnerabilities

### Rate Limiting

- Throttling to protect against brute force attacks
- Configurable time windows and request limits
- Environment-specific throttling settings

### CORS Configuration

- Restrictive CORS policy with configurable allowed origins
- Credential support for authenticated requests
- Method and header restrictions

## Health Monitoring

The application includes health check endpoints to monitor system status:

### Database Health Service

- Monitors MongoDB connection status
- Provides detailed metrics on database performance
- Enables integration with monitoring systems

### Health Check Endpoints

- `/health`: Overall application health status
- `/health/database`: MongoDB connection status and metrics

## GraphQL Implementation

### GraphQL Schema

- Code-first approach using NestJS decorators
- Auto-generated schema using @nestjs/graphql
- Strong typing with TypeScript integration

### Queries & Mutations

- **Author Queries**: getAuthor, getAuthors
- **Author Mutations**: createAuthor, updateAuthor, deleteAuthor
- **Book Queries**: getBook, getBooks, getBooksByAuthor
- **Book Mutations**: createBook, updateBook, deleteBook
- **User Queries**: getUser, getUsers
- **User Mutations**: createUser, updateUser, deleteUser
- **Rental Queries**: getRental, getRentals, getUserRentals
- **Rental Mutations**: createRental, returnBook

### GraphQL Playground

- Interactive API documentation in development
- Disabled in production for security
- Testing interface for API exploration

## MongoDB Integration

### Mongoose Configuration

- Asynchronous module configuration
- Advanced connection options for reliability
- Environment-specific database settings

### Schema Design

- Mongoose schema definitions with TypeScript integration
- Validation rules at the database level
- Indexes for query optimization

### Connection Management

- Connection pooling for performance
- Error handling and reconnection logic
- Event listeners for connection lifecycle

## Error Handling

- Global exception filter for consistent error responses
- GraphQL-specific error formatting
- Detailed logging for troubleshooting

## Testing Capabilities

The project includes a testing framework configuration:

- Unit test setup with Jest
- E2E testing configuration
- Test environment configuration

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB instance
- NPM or Yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/book-vault.git

# Install dependencies
npm install

# Set up environment configuration
npm run env:dev

# Start the development server
npm run start:dev
```

### API Examples

#### Query All Books

```graphql
query {
  getBooks {
    id
    title
    isbn
    author {
      name
    }
  }
}
```

#### Create a New Author

```graphql
mutation {
  createAuthor(createAuthorInput: {
    name: "Jane Doe",
    bio: "Contemporary fiction author"
  }) {
    id
    name
  }
}
```

#### Rent a Book

```graphql
mutation {
  createRental(createRentalInput: {
    userId: "user-id",
    bookId: "book-id",
    dueDate: "2025-05-18T00:00:00Z"
  }) {
    id
    rentalDate
    dueDate
    book {
      title
    }
    user {
      name
    }
  }
}
```

## Future Enhancements

Potential areas for future development include:

- Authentication and authorization system
- Payment processing integration
- Email notifications for due dates
- Recommendation engine based on reading history
- Elasticsearch integration for advanced search capabilities

## Conclusion

The BookVault GraphQL API provides a modern, secure, and well-structured system for book rental management. With its comprehensive domain model, robust configuration system, and security features, it serves as an excellent foundation for building book rental applications and services.