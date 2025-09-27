# Employee Data Management System

A full-stack CRUD application for managing employee data with Node.js/Express backend and React frontend.

## Features

- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ RESTful API with proper validation
- ✅ SQLite database with auto-initialization
- ✅ React frontend with responsive design
- ✅ Search/filter functionality
- ✅ Form validation (frontend and backend)
- ✅ Comprehensive test suite
- ✅ Error handling and status codes

## Tech Stack

**Backend:**
- Node.js (v18+)
- Express.js
- SQLite3
- Jest + Supertest (testing)

**Frontend:**
- React (via Vite)
- JavaScript
- CSS3

## Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:4000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get employee by ID |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

## Sample cURL Commands

### Get all employees
```bash
curl -X GET http://localhost:4000/api/employees
```

### Get employee by ID
```bash
curl -X GET http://localhost:4000/api/employees/1
```

### Create new employee
```bash
curl -X POST http://localhost:4000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","position":"Software Engineer"}'
```

### Update employee
```bash
curl -X PUT http://localhost:4000/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Smith","email":"johnsmith@example.com","position":"Senior Software Engineer"}'
```

### Delete employee
```bash
curl -X DELETE http://localhost:4000/api/employees/1
```

## Running Tests

```bash
cd backend
npm test
```

## Project Structure

```
employee-data-management/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── data/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
└── README.md
```

## Development Notes

- Backend runs on port 4000
- Frontend runs on port 5173 (Vite default)
- SQLite database is stored in `backend/data/employees.db`
- Database is auto-initialized on first run
- Sample data is seeded automatically

## Assumptions and Design Choices

### Backend Architecture
- **SQLite Database**: Chosen for simplicity and zero-configuration setup. Uses `sql.js` (pure JavaScript implementation) to avoid native compilation issues on Windows
- **RESTful API Design**: Follows REST conventions with proper HTTP status codes (200, 201, 400, 404, 409, 500)
- **Validation Strategy**: Implemented both client-side and server-side validation for data integrity and user experience
- **Error Handling**: Centralized error handling middleware with consistent error response format

### Frontend Architecture
- **React with Hooks**: Used functional components with hooks for modern React development
- **State Management**: Kept simple with built-in React state (useState) - no external state management needed for this scope
- **UI/UX Decisions**:
  - Modal-based forms for better user experience and space efficiency
  - Debounced search (300ms) to reduce API calls during typing
  - Responsive design with mobile-first approach
  - Loading states and error notifications for better user feedback

### Database Schema
```sql
employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  position TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Security Considerations
- Input sanitization and validation on both frontend and backend
- CORS configuration for cross-origin requests
- Helmet.js for security headers
- Email uniqueness constraint to prevent duplicates

### Performance Optimizations
- Database connection pooling (single connection per request)
- Debounced search to minimize API calls
- Efficient SQL queries with proper indexing on email field
- Frontend component optimization with proper key props

### Testing Strategy
- Comprehensive backend API testing with Jest and Supertest
- Test coverage includes success cases, error cases, and edge cases
- Isolated test database to prevent interference with development data
- Mock implementations for database operations in tests

## License

MIT License