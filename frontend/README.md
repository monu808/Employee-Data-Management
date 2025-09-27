# Frontend README

## Employee Data Management - Frontend

A React-based frontend application for managing employee data with a clean, responsive interface.

### Features

- Modern React 18 with hooks
- Responsive design that works on all devices
- Real-time search and filtering
- Form validation with inline error messages
- Modal-based forms for add/edit operations
- Clean and intuitive user interface
- Error handling and loading states

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:4000
```

For production, update the URL to your deployed backend.

### Project Structure

```text
frontend/
├── src/
│   ├── components/      # React components
│   ├── services/        # API service layer
│   ├── styles/          # CSS stylesheets
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
└── package.json
```

### Components

#### App.jsx
Main application component that manages global state and routing.

#### EmployeeList.jsx
Displays employees in a responsive table with search highlighting.

#### EmployeeForm.jsx
Modal form for creating and editing employees with real-time validation.

#### SearchBar.jsx
Debounced search input with clear functionality.

#### Modal.jsx
Reusable modal component with keyboard support.

### Styling

The application uses vanilla CSS with:

- CSS custom properties (variables)
- Flexbox and Grid layouts
- Responsive design principles
- Smooth animations and transitions
- Accessible color contrast

### API Integration

The frontend communicates with the backend API through the `EmployeeService` class:

```javascript
// Get all employees
const employees = await EmployeeService.getAllEmployees();

// Search employees
const results = await EmployeeService.getAllEmployees('search term');

// Create employee
const newEmployee = await EmployeeService.createEmployee({
  name: 'John Doe',
  email: 'john@example.com',
  position: 'Software Engineer'
});
```

### Form Validation

Client-side validation includes:

- Required field validation
- Email format validation
- Name format validation (letters, spaces, hyphens, apostrophes)
- Length restrictions
- Real-time error display

### Responsive Design

The application is fully responsive with breakpoints:

- Desktop: > 768px
- Tablet: 640px - 768px
- Mobile: < 640px

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2015+ features
- CSS Grid and Flexbox

### Development

To customize the API base URL, update the `API_BASE_URL` constant in `src/services/employeeService.js` or use environment variables.

The development server includes:

- Hot module replacement
- Proxy configuration for API calls
- Source maps for debugging

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

### Deployment

The built application can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

Make sure to update the `VITE_API_BASE_URL` environment variable to point to your production backend.