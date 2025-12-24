# Shipment Tracking & User Management System

## GitHub Repository
[GitHub Repository Link](https://github.com/your-username/shipment-tracking-system)

## Overview
This project is a Shipment Tracking and User Management System built with Node.js, TypeScript, and Express.js. It includes user authentication, role-based access control, and utilizes a MySQL database with TypeORM for data management.

## Features
- User authentication with JWT
- Role-based access control (RBAC)
- Shipment creation and tracking
- User management functionalities
- **Bonus Features:**
  - Pagination for shipment listings
  - API rate limiting
  - Swagger API documentation
  - Unit tests with Jest
  - Docker containerization

## Tech Stack
- **Backend:** Node.js, TypeScript, Express.js
- **Database:** MySQL with TypeORM
- **Authentication:** JWT
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest, Supertest
- **Containerization:** Docker, Docker Compose

## Project Structure
```
shipment-tracking-system/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── swagger-config.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── companyController.ts
│   │   ├── shipmentController.ts
│   │   └── userController.ts
│   ├── dto/
│   │   ├── auth.dto.ts
│   │   ├── company.dto.ts
│   │   ├── shipment.dto.ts
│   │   └── user.dto.ts
│   ├── entities/
│   │   ├── Company.ts
│   │   ├── Role.ts
│   │   ├── Shipment.ts
│   │   ├── ShipmentEvent.ts
│   │   └── User.ts
│   ├── error/
│   │   ├── api-exception.ts
│   │   ├── invalid-request-exception.ts
│   │   ├── jwt-error.ts
│   │   └── unhandled-exception.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   ├── rbacMiddleware.ts
│   │   └── validationMiddleware.ts
│   │   
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── companyRoutes.ts
│   │   ├── shipmentRoutes.ts
│   │   └── userRoutes.ts
│   ├── seeds/
│   │   └── seed.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── companyService.ts
│   │   ├── shipmentService.ts
│   │   └── userService.ts
│   ├── utils/
│   │   ├── api-response.ts
│   │   ├── trimmer.ts
│   │   └── validation.ts
│   ├── app.ts
│   └── index.ts
├── tests/
│   ├── auth.test.ts
│   ├── company.test.ts
│   ├── shipment.test.ts
│   └── user.test.ts
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── nodemon.json
├── package.json
├── package-lock.json
├── query
├── README.md
├── test-db.js
├── tsconfig.json
└── .gitignore
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd shipment-tracking-system
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Install dependencies:
   ```
   npm run dev:nodemon (Run locally)
   ```

## Configuration
1. Create a `.env` file in the root directory based on `.env.example`:
   ```
   JWT_SECRET=your_jwt_secret
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_NAME=shipment_tracking_db
   PORT=3000
   ```
   Replace the values with your MySQL credentials and a secure JWT secret.

## Running the Application

### Local Development
1. Ensure MySQL is running and configured.
2. Run database migrations/seeds if needed (check `src/seeds/seed.ts`).
3. Start the server with auto-restart (recommended for development):
   ```
   npm run dev
   ```
   Or use nodemon for compiled code watching:
   ```
   npm run dev:nodemon
   ```
4. The application will be running on `http://localhost:3000`.

### Production
1. Build the application:
   ```
   npm run build
   ```
2. Start the server:
   ```
   npm start
   ```

### Docker
1. Build and run with Docker Compose:
   ```
   docker-compose up --build
   ```
2. The application will be available at `http://localhost:3000`.
3. API documentation at `http://localhost:3000/api-docs`.

## Testing
1. Run unit tests:
   ```
   npm test
   ```
   Note: Tests require a running database connection. Ensure the database is set up before running tests.

## API Documentation
Access the Swagger API documentation at `http://localhost:3000/api-docs` when the server is running.

## API Endpoints
### Authentication
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Authenticate a user and return a JWT

### Shipments
- `POST /api/shipments`: Create a new shipment (Requires COMPANY_USER role)
- `GET /api/shipments`: Get all shipments with pagination (Requires CUSTOMER, COMPANY_USER, or SUPER_ADMIN role; Query params: page, limit, status)
- `GET /api/shipments/{shipmentId}`: Retrieve shipment details by ID (Requires CUSTOMER role)
- `PUT /api/shipments/{shipmentId}/status`: Update shipment status (Requires COMPANY_USER role)
- `POST /api/shipments/{shipmentId}/event`: Add shipment event (Requires COMPANY_USER role)

### Users
- `POST /api/users`: Create a new user (Requires SUPER_ADMIN role)
- `GET /api/users`: Get all users (Requires SUPER_ADMIN role)
- `GET /api/users/{id}`: Retrieve user details by ID (Requires SUPER_ADMIN or COMPANY_USER role)
- `PUT /api/users/{id}`: Update user (Requires SUPER_ADMIN role)
- `DELETE /api/users/{id}`: Delete user (Requires SUPER_ADMIN role)

### Companies
- `POST /api/companies`: Create a new company (Requires SUPER_ADMIN role)
- `GET /api/companies`: Get all companies (Requires SUPER_ADMIN role)
- `GET /api/companies/{id}`: Retrieve company details by ID (Requires SUPER_ADMIN or COMPANY_USER role)

## Database Schema
### User
- `id`: Primary Key (INT)
- `username`: VARCHAR(255), unique
- `email`: VARCHAR(255), nullable, unique
- `password`: VARCHAR(255), hashed
- `role_id`: Foreign Key to Role (INT)
- `company_id`: Foreign Key to Company (INT), nullable
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Role
- `id`: Primary Key (INT)
- `name`: ENUM ('SUPER_ADMIN', 'COMPANY_USER', 'CUSTOMER'), unique
- `created_at`: TIMESTAMP

### Company
- `id`: Primary Key (INT)
- `name`: VARCHAR(255)
- `created_by_id`: Foreign Key to User (INT), nullable
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Shipment
- `id`: Primary Key (INT)
- `shipment_id`: VARCHAR(255), unique (e.g., SHP123)
- `tracking_number`: VARCHAR(255), unique, nullable
- `sender_address`: TEXT, nullable
- `receiver_address`: TEXT, nullable
- `weight`: FLOAT, nullable
- `description`: TEXT, nullable
- `status`: ENUM ('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'ARRIVED_AT_PORT', 'DELIVERED'), default 'PENDING'
- `created_by_id`: Foreign Key to User (INT), nullable
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### ShipmentEvent
- `id`: Primary Key (INT)
- `shipment_id`: Foreign Key to Shipment (INT)
- `event`: ENUM ('PICKED_UP', 'IN_TRANSIT', 'ARRIVED_AT_PORT', 'DELIVERED')
- `location`: VARCHAR(255), nullable
- `description`: TEXT, nullable
- `timestamp`: TIMESTAMP

## Environment Variables
Refer to `.env.example` for the required environment variables:

- `JWT_SECRET`: Secret key for JWT token generation
- `DB_HOST`: MySQL database host
- `DB_PORT`: MySQL database port
- `DB_USERNAME`: MySQL database username
- `DB_PASSWORD`: MySQL database password
- `DB_NAME`: MySQL database name
- `PORT`: Application port

## License
This project is licensed under the MIT License.