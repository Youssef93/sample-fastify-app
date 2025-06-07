# Fastify & Knex Boilerplate

A modern Node.js API boilerplate built with Fastify and Knex, featuring auto-generated Swagger documentation, TypeScript support, route validation, error handling, structured routing, and proper logging with GCP request tracing (can be replaced with other loggers as needed)

## Features

- **Fastify**: High-performance web framework
- **Knex**: A query builder for SQL with typescript support
- **TypeScript**: Full type safety throughout the codebase
- **PostgreSQL**: Database support
- **Swagger UI**: Auto-generated API documentation
- **Structured Project Layout**: Well-organized code structure
- **Environment Configuration**: Easy environment variable management
- **OpenTelemetry**: Instrumentation for observability
- **Docker Support**: Containerization ready
- **ESLint & Prettier**: Code quality and formatting
- **Jest**: Testing framework

## Getting Started

### Database Setup

1. Configure your PostgreSQL connection:
   - Update the `.env.local` file with your database connection string:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/your_database
     PORT=3000
     ```

2. Generate database migrations:
   ```bash
   npm run migrate:create <filename>
   ```

3. The migrations will be created in `src/database/migrations` directory

### Running the Application

- Development mode with hot reload:
  ```bash
  npm run dev
  ```

- Build the application:
  ```bash
  npm run build
  ```

- Run in production mode:
  ```bash
  npm run serve
  ```

- Run tests:
  ```bash
  npm test
  ```

## Project Structure

```
src/
├── modules/ # Modules
	├── routes # Route definitions
	├── controllers # Request handlers and route definitions
	├── services # Business logic layer
	├── repositories # Database queries happen in this layer
	└── types # TypeScript type definitions
	└── spec # OpenAPI spec
	└── framework # Framework code
	└── tests # Test cases
	└── database
		└── migrations # Database migrations
		└── seeds # Database seeds
├── entities # Database entities & AJV schema definitions
├── framework # Framework code
```

## API Documentation

Swagger UI is available at `/swagger` when the application is running.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Application port (default: 3000)

## License

This project is licensed under the ISC License.