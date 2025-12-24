# Shipment Tracking & User Management System

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
│   │   └── database.ts
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
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   └── rbacMiddleware.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── companyRoutes.ts
│   │   ├── shipmentRoutes.ts
│   │   └── userRoutes.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── companyService.ts
│   │   ├── shipmentService.ts
│   │   └── userService.ts
│   ├── utils/
│   │   └── validation.ts
│   ├── app.ts
│   └── index.ts
├── tests/
│   └── auth.test.ts
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── tsconfig.json
├── .env
└── README.md
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

## Configuration
1. Create a `.env` file in the root directory and add the following environment variables:
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/database_name
   JWT_SECRET=your_jwt_secret
   ```
   Replace `user`, `password`, and `database_name` with your MySQL credentials.

## Running the Application

### Local Development
1. Ensure MySQL is running and configured.
2. Start the server with auto-restart (recommended for development):
   ```
   npm run dev
   ```
   Or use nodemon for compiled code watching:
   ```
   npm run dev-nodemon
   ```
3. The application will be running on `http://localhost:3000`.

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
- `POST /api/auth/signup`: Create a new user
- `POST /api/auth/login`: Authenticate a user and return a JWT

### Shipments
- `POST /api/shipments`: Create a new shipment (Requires COMPANY_USER role)
- `GET /api/shipments`: Get all shipments with pagination (Query params: page, limit)
- `GET /api/shipments/:id`: Retrieve shipment details by ID
- `PUT /api/shipments/:id/status`: Update shipment status (Requires COMPANY_USER role)
- `POST /api/shipments/:id/event`: Add shipment event (Requires COMPANY_USER role)

### Users
- `POST /api/users`: Create a new user (Requires SUPER_ADMIN role)
- `GET /api/users`: Get all users (Requires SUPER_ADMIN role)
- `GET /api/users/:id`: Retrieve user details by ID
- `PUT /api/users/:id`: Update user (Requires SUPER_ADMIN role)
- `DELETE /api/users/:id`: Delete user (Requires SUPER_ADMIN role)

### Companies
- `POST /api/companies`: Create a new company (Requires SUPER_ADMIN role)
- `GET /api/companies`: Get all companies (Requires SUPER_ADMIN role)
- `GET /api/companies/:id`: Retrieve company details by ID

## Database Schema
### User
- `id`: Primary Key
- `username`: String (unique)
- `password`: String (hashed)
- `roleId`: Foreign Key to Role
- `companyId`: Foreign Key to Company (optional)

### Role
- `id`: Primary Key
- `name`: String (enum: SUPER_ADMIN, COMPANY_USER, CUSTOMER)

### Company
- `id`: Primary Key
- `name`: String
- `address`: String (optional)

### Shipment
- `id`: Primary Key
- `status`: String (enum: PENDING, IN_TRANSIT, DELIVERED, CANCELLED)
- `createdById`: Foreign Key to User
- `createdAt`: DateTime
- `updatedAt`: DateTime

### ShipmentEvent
- `id`: Primary Key
- `shipmentId`: Foreign Key to Shipment
- `event`: String
- `timestamp`: DateTime

## License
This project is licensed under the MIT License.