# BookVault GraphQL API

A NestJS GraphQL API for book rentals with MongoDB integration. This application provides a robust backend for managing authors, books, users, and rental transactions.

## Features

- **GraphQL API**: Modern API using GraphQL for efficient data querying
- **MongoDB Integration**: Persistence with MongoDB using Mongoose ODM
- **Environment Configuration**: Structured configuration system for different environments
- **Security Features**:
  - CSRF Protection
  - Rate Limiting
  - Helmet Security Headers
  - CORS Configuration
- **Health Monitoring**: Endpoints for application and database health checking

## Technology Stack

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [GraphQL](https://graphql.org/) - Query language for APIs
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - GraphQL server
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling

## Project Structure

```plaintext
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── schema.gql                 # Generated GraphQL schema
├── authors/                   # Author domain module
├── books/                     # Book domain module
├── users/                     # User domain module
├── rentals/                   # Rental domain module
├── config/                    # Configuration module
│   ├── envs/                  # Environment-specific configurations
│   └── README.md              # Configuration documentation
└── health/                    # Health check endpoints
```

## ERD Diagram

The database schema for this project is available in the root directory:

- `book_rental_erd.png` - Visual representation of the database schema
- `book_rental_erd.drawio` - Source file for the ERD diagram

## Installation

```bash
# Install dependencies
npm install
```

## Environment Setup

The application uses environment-specific configurations. Setup the appropriate environment:

```bash
# Development environment
npm run env:dev

# Production environment
npm run env:prod

# Test environment
npm run env:test
```

Update the generated `.env.*` file with your specific configuration values.

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## API Documentation

Once the application is running, you can access the GraphQL playground at:

- Development: [http://localhost:3000/graphql](http://localhost:3000/graphql)

The GraphQL playground provides interactive documentation for exploring the API.

## Available GraphQL Resources

### Authors

- Query authors
- Create, update, and delete authors
- View books written by an author

### Books

- Query books with filters
- Create, update, and delete books
- Associate books with authors

### Users

- User registration and management
- User profile information

### Rentals

- Book checkout and return process
- Rental history tracking
- Due date management

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Configuration

The application uses a hierarchical configuration system with environment-specific settings. See `src/config/README.md` for detailed documentation on configuration options.

## Health Checks

The application provides health check endpoints:

- GET `/health` - Overall application health
- GET `/health/database` - Database connection status

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the [UNLICENSED](LICENSE) license.
[EOF]
