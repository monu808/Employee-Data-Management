const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');
const { initializeDatabase } = require('../src/utils/database');

// Test database path
const TEST_DB_PATH = path.join(__dirname, '../data/test_employees.db');

// Mock database path for testing
jest.mock('../src/utils/database', () => {
  const Database = require('better-sqlite3');
  const path = require('path');
  const fs = require('fs');

  const createConnection = () => {
    try {
      const db = new Database(TEST_DB_PATH);
      return db;
    } catch (err) {
      console.error('Error opening test database:', err);
      throw err;
    }
  };

  const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
      try {
        const db = createConnection();
        
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            position TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `;
        
        db.exec(createTableQuery);
        
        // Seed test data
        const sampleEmployees = [
          { name: 'Alice Johnson', email: 'alice.johnson@example.com', position: 'Software Engineer' },
          { name: 'Bob Smith', email: 'bob.smith@example.com', position: 'Product Manager' },
          { name: 'Carol Davis', email: 'carol.davis@example.com', position: 'UX Designer' },
          { name: 'David Wilson', email: 'david.wilson@example.com', position: 'DevOps Engineer' },
          { name: 'Eva Brown', email: 'eva.brown@example.com', position: 'Data Analyst' }
        ];
        
        const insertStmt = db.prepare('INSERT INTO employees (name, email, position) VALUES (?, ?, ?)');
        const insertMany = db.transaction((employees) => {
          for (const employee of employees) {
            insertStmt.run(employee.name, employee.email, employee.position);
          }
        });
        
        insertMany(sampleEmployees);
        db.close();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };

  return {
    initializeDatabase,
    getDatabase: createConnection,
    closeDatabase: (db) => {
      return new Promise((resolve) => {
        db.close();
        resolve();
      });
    },
    DB_PATH: TEST_DB_PATH
  };
});

describe('Employee API Endpoints', () => {
  let server;
  
  beforeAll(async () => {
    // Initialize test database
    await initializeDatabase();
  });
  
  afterAll(async () => {
    // Clean up test database
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });
  
  beforeEach(async () => {
    // Clear database before each test
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    await initializeDatabase();
  });
  
  describe('GET /api/employees', () => {
    test('should return all employees', async () => {
      const response = await request(app)
        .get('/api/employees')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      expect(response.body.message).toContain('retrieved successfully');
    });
    
    test('should search employees by name', async () => {
      const response = await request(app)
        .get('/api/employees?search=Alice')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.message).toContain('Found');
    });
    
    test('should return empty array for non-matching search', async () => {
      const response = await request(app)
        .get('/api/employees?search=NonExistentName')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });
  });
  
  describe('GET /api/employees/:id', () => {
    test('should return specific employee', async () => {
      const response = await request(app)
        .get('/api/employees/1')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('position');
    });
    
    test('should return 404 for non-existent employee', async () => {
      const response = await request(app)
        .get('/api/employees/999')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
    
    test('should return 400 for invalid employee ID', async () => {
      const response = await request(app)
        .get('/api/employees/invalid')
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });
  
  describe('POST /api/employees', () => {
    const validEmployee = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'Software Engineer'
    };
    
    test('should create new employee with valid data', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send(validEmployee)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(validEmployee.name);
      expect(response.body.data.email).toBe(validEmployee.email.toLowerCase());
      expect(response.body.data.position).toBe(validEmployee.position);
      expect(response.body.message).toContain('created successfully');
    });
    
    test('should return 400 for missing name', async () => {
      const invalidEmployee = { ...validEmployee };
      delete invalidEmployee.name;
      
      const response = await request(app)
        .post('/api/employees')
        .send(invalidEmployee)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
    });
    
    test('should return 400 for invalid email', async () => {
      const invalidEmployee = {
        ...validEmployee,
        email: 'invalid-email'
      };
      
      const response = await request(app)
        .post('/api/employees')
        .send(invalidEmployee)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
    
    test('should return 400 for missing position', async () => {
      const invalidEmployee = { ...validEmployee };
      delete invalidEmployee.position;
      
      const response = await request(app)
        .post('/api/employees')
        .send(invalidEmployee)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
    
    test('should return 409 for duplicate email', async () => {
      // First create an employee
      await request(app)
        .post('/api/employees')
        .send(validEmployee)
        .expect(201);
      
      // Try to create another with same email
      const duplicateEmployee = {
        ...validEmployee,
        name: 'Jane Doe'
      };
      
      const response = await request(app)
        .post('/api/employees')
        .send(duplicateEmployee)
        .expect(409);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });
  
  describe('PUT /api/employees/:id', () => {
    let employeeId;
    const updateData = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      position: 'Senior Software Engineer'
    };
    
    beforeEach(async () => {
      // Create an employee to update
      const createResponse = await request(app)
        .post('/api/employees')
        .send({
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Software Engineer'
        });
      employeeId = createResponse.body.data.id;
    });
    
    test('should update employee with valid data', async () => {
      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .send(updateData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(updateData.email.toLowerCase());
      expect(response.body.data.position).toBe(updateData.position);
      expect(response.body.message).toContain('updated successfully');
    });
    
    test('should return 404 for non-existent employee', async () => {
      const response = await request(app)
        .put('/api/employees/999')
        .send(updateData)
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
    
    test('should return 400 for invalid data', async () => {
      const invalidData = { ...updateData, email: 'invalid-email' };
      
      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .send(invalidData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });
  
  describe('DELETE /api/employees/:id', () => {
    let employeeId;
    
    beforeEach(async () => {
      // Create an employee to delete
      const createResponse = await request(app)
        .post('/api/employees')
        .send({
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Software Engineer'
        });
      employeeId = createResponse.body.data.id;
    });
    
    test('should delete existing employee', async () => {
      const response = await request(app)
        .delete(`/api/employees/${employeeId}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
      
      // Verify employee is deleted
      await request(app)
        .get(`/api/employees/${employeeId}`)
        .expect(404);
    });
    
    test('should return 404 for non-existent employee', async () => {
      const response = await request(app)
        .delete('/api/employees/999')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
    
    test('should return 400 for invalid employee ID', async () => {
      const response = await request(app)
        .delete('/api/employees/invalid')
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });
  
  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body.message).toContain('running');
      expect(response.body.timestamp).toBeDefined();
    });
  });
  
  describe('404 Handler', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);
      
      expect(response.body.error).toBe('Route not found');
      expect(response.body.message).toContain('Cannot GET');
    });
  });
});