# Backend README

## Employee Data Management - Backend API

A RESTful API built with Node.js and Express for managing employee data with SQLite database.

### Features

- Complete CRUD operations for employees
- Input validation and sanitization
- Search functionality
- SQLite database with auto-initialization
- Comprehensive test suite
- Error handling and logging
- CORS support for frontend integration

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:4000`

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run seed` - Seed database with sample data

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees (supports ?search=term) |
| GET | `/api/employees/:id` | Get employee by ID |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/health` | Health check endpoint |

### Request/Response Examples

#### Create Employee
```bash
curl -X POST http://localhost:4000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com", 
    "position": "Software Engineer"
  }'
```

#### Response Format
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "position": "Software Engineer",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "message": "Employee created successfully"
}
```

### Database Schema

```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  position TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Variables

The backend uses the following environment variables:

- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

### Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- All CRUD operations
- Input validation
- Error handling
- Search functionality
- Edge cases

### Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

### Database Location

- Development: `backend/data/employees.db`
- Tests: `backend/data/test_employees.db`

The database is automatically created and seeded with sample data on first run.

### Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   └── utils/           # Utilities and database
├── tests/               # Test files
├── data/                # Database files
└── package.json
```