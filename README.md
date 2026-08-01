# Smart Expense Tracker API

## Live Demo
- **Base URL:** `https://your-app-url`

- **Swagger UI:** `https://your-app-url/api-docs`

> **Note:** The deployed version uses local JSON file storage. Since most free hosting providers use ephemeral file systems, data may reset when the application restarts.

## Project Overview
The Smart Expense Tracker API is a RESTful web service built with Node.js and Express to help users manage their personal expenses. Designed as a robust backend assignment, it leverages local JSON file storage to provide complete CRUD operations and insights into expense data without requiring a complex database setup.

## Features Implemented
- **Create Expenses**: Log new expenses with validation for dates, amounts, and categories.
- **List Expenses**: Retrieve all expenses, or filter them specifically by category.
- **Expense Summaries**: Get total expenses and category-wise breakdowns for actionable insights.
- **Delete Expenses**: Safely remove expense records by their unique UUID.
- **Centralized Error Handling**: Unified and consistent API response structures across all success and error scenarios.
- **Input Validation**: Strict request payload validation using `express-validator`.
- **API Documentation**: Interactive OpenAPI (Swagger) UI available out-of-the-box.
- **Health Checks**: Endpoint to monitor the API status and environment.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Validation**: express-validator
- **Security & Headers**: helmet, cors
- **Logging**: morgan
- **Documentation**: swagger-ui-express, swagger-jsdoc
- **Testing**: Jest, Supertest

## Project Folder Structure
```
smart-expense-tracker/
├── src/
│   ├── config/          # Configuration files (Swagger)
│   ├── controllers/     # Route handlers and business flow
│   ├── data/            # Local JSON storage directory
│   ├── middlewares/     # Global error handling and validation
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic and file operations
│   ├── utils/           # Helpers (AppError, response formatting)
│   ├── validators/      # Schema definitions for express-validator
│   ├── app.js           # Express app setup and middleware
│   └── server.js        # Server initialization
├── tests/
│   └── expense.test.js  # Integration tests for the API
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

## Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

## Installation
1. Clone the repository
   ```bash
   git clone https://github.com/Jayendra4/Smart-Expense-Tracker-API.git
   cd Smart-Expense-Tracker-API
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up environment variables
   ```bash
   cp .env.example .env
   ```

## Running the Development Server
To start the server in development mode with live reloading:
```bash
npm run dev
```
To start the server in production mode:
```bash
npm start
```
The server will run on `http://localhost:3000` (or the port specified in `.env`).

## Environment Variables

Create a `.env` file .

```env
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000
```

## Running the Test Suite
This project uses Jest and Supertest for testing. To run the integration tests:
```bash
npm test
```

## Swagger Documentation
- **Local:** `http://localhost:3000/api-docs`

- **Live:** `https://smart-expense-tracker.onrender.com/api-docs`

## API Reference

### Root Endpoint
- **Method**: GET
- **Route**: `/`
- **Description**: Returns a welcome message and links to main endpoints.

### Health Endpoint
- **Method**: GET
- **Route**: `/health`
- **Description**: Returns the current status and environment of the server.

### Expenses Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/expenses` | Create a new expense record |
| GET | `/api/expenses` | Retrieve all expenses (supports `?category=` filter) |
| GET | `/api/expenses/summary` | Return total expenses and category-wise breakdown |
| DELETE | `/api/expenses/:id` | Permanently delete an expense by its unique ID |

## Sample Request and Response

### Create an Expense (POST `/api/expenses`)

**Request Body:**
```json
{
  "title": "Groceries",
  "amount": 45.50,
  "category": "Food",
  "date": "2026-08-01T12:00:00.000Z"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Expense successfully created",
  "data": {
    "expense": {
      "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
      "title": "Groceries",
      "amount": 45.50,
      "category": "Food",
      "date": "2026-08-01T12:00:00.000Z"
    }
  }
}
```

## Error Response Example

The API uses a standardized envelope for all errors.

**Validation Failed (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}
```

## Validation Information
All incoming requests are strictly validated before hitting the controller logic:
- `title`: Must be a non-empty string.
- `amount`: Must be a positive numeric value.
- `category`: Must be a non-empty string.
- `date`: Must be a valid ISO 8601 Date string.

## Project Architecture Overview
The application follows a standard layered architecture:
1. **Routes Layer**: Defines API endpoints and maps them to controllers. Includes validation middleware.
2. **Controller Layer**: Handles HTTP requests, extracts parameters, calls services, and formats the response using a standardized helper.
3. **Service Layer**: Contains core business logic and data manipulation.
4. **Data Layer**: Reads and writes to a local JSON file (`src/data/expenses.json`) using `fs.promises`.
5. **Global Middleware**: Catches unhandled exceptions and validation errors centrally.

## Packages Used
- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `express-validator`: Express middleware for string validators and sanitizers.
- `cors`: Middleware to enable Cross-Origin Resource Sharing.
- `helmet`: Helps secure Express apps by setting various HTTP headers.
- `morgan`: HTTP request logger middleware.
- `swagger-ui-express` & `swagger-jsdoc`: Generates and serves interactive OpenAPI docs.
- `dotenv`: Loads environment variables from a `.env` file.
- `jest` & `supertest`: Testing framework and HTTP assertion library.

## License
Distributed under the MIT License.

## Author

**Jayendra**
- GitHub: https://github.com/Jayendra4