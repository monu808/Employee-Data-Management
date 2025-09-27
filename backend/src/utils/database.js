const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

// Database file path
const DB_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DB_DIR, 'employees.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let SQL = null;

// Initialize SQL.js
const initSQL = async () => {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  return SQL;
};

// Create database connection
const createConnection = async () => {
  try {
    const SQL = await initSQL();
    let db;
    
    if (fs.existsSync(DB_PATH)) {
      // Load existing database
      const filebuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(filebuffer);
    } else {
      // Create new database
      db = new SQL.Database();
    }
    
    console.log('Connected to SQLite database');
    return db;
  } catch (err) {
    console.error('Error opening database:', err);
    throw err;
  }
};

// Save database to file
const saveDatabase = (db) => {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
};

// Initialize database with tables and seed data
const initializeDatabase = async () => {
  try {
    const db = await createConnection();
    
    // Create employees table
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
    
    db.run(createTableQuery);
    console.log('Employees table created or already exists');
    
    // Check if we need to seed data
    const result = db.exec('SELECT COUNT(*) as count FROM employees');
    const count = result.length > 0 ? result[0].values[0][0] : 0;
    
    if (count === 0) {
      console.log('Seeding initial data...');
      seedInitialData(db);
      console.log('Sample data seeded successfully');
    } else {
      console.log(`Database already contains ${count} employees`);
    }
    
    saveDatabase(db);
    db.close();
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};

// Seed initial data
const seedInitialData = (db) => {
  const sampleEmployees = [
    {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      position: 'Software Engineer'
    },
    {
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      position: 'Product Manager'
    },
    {
      name: 'Carol Davis',
      email: 'carol.davis@example.com',
      position: 'UX Designer'
    },
    {
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      position: 'DevOps Engineer'
    },
    {
      name: 'Eva Brown',
      email: 'eva.brown@example.com',
      position: 'Data Analyst'
    }
  ];
  
  sampleEmployees.forEach((employee) => {
    db.run(`
      INSERT INTO employees (name, email, position)
      VALUES (?, ?, ?)
    `, [employee.name, employee.email, employee.position]);
    console.log(`Inserted employee: ${employee.name}`);
  });
};

// Get database connection
const getDatabase = () => {
  return createConnection();
};

// Close database connection
const closeDatabase = (db) => {
  try {
    db.close();
  } catch (err) {
    console.error('Error closing database:', err);
  }
};

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  saveDatabase,
  DB_PATH
};