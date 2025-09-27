const { getDatabase, saveDatabase } = require('../utils/database');

class EmployeeService {
  // Get all employees with optional search
  static async getAllEmployees(searchTerm = '') {
    try {
      const db = await getDatabase();
      let query = 'SELECT * FROM employees ORDER BY created_at DESC';
      let params = [];
      
      if (searchTerm) {
        query = 'SELECT * FROM employees WHERE name LIKE ? OR email LIKE ? OR position LIKE ? ORDER BY created_at DESC';
        const searchPattern = `%${searchTerm}%`;
        params = [searchPattern, searchPattern, searchPattern];
      }
      
      const result = db.exec(query, params);
      const rows = result.length > 0 ? result[0].values.map((row, index) => {
        const columns = result[0].columns;
        const employee = {};
        columns.forEach((col, i) => {
          employee[col] = row[i];
        });
        return employee;
      }) : [];
      
      db.close();
      return rows;
    } catch (err) {
      throw err;
    }
  }
  
  // Get employee by ID
  static async getEmployeeById(id) {
    try {
      const db = await getDatabase();
      const result = db.exec('SELECT * FROM employees WHERE id = ?', [id]);
      
      let employee = null;
      if (result.length > 0 && result[0].values.length > 0) {
        const columns = result[0].columns;
        const row = result[0].values[0];
        employee = {};
        columns.forEach((col, i) => {
          employee[col] = row[i];
        });
      }
      
      db.close();
      return employee;
    } catch (err) {
      throw err;
    }
  }
  
  // Create new employee
  static async createEmployee(employeeData) {
    try {
      const db = await getDatabase();
      const { name, email, position } = employeeData;
      
      db.run(`
        INSERT INTO employees (name, email, position, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `, [name, email, position]);
      
      // Get the created employee (get the last inserted row)
      const result = db.exec('SELECT * FROM employees ORDER BY id DESC LIMIT 1');
      
      let employee = null;
      if (result.length > 0 && result[0].values.length > 0) {
        const columns = result[0].columns;
        const row = result[0].values[0];
        employee = {};
        columns.forEach((col, i) => {
          employee[col] = row[i];
        });
      }
      
      saveDatabase(db);
      db.close();
      return employee;
    } catch (err) {
      throw err;
    }
  }
  
  // Update employee
  static async updateEmployee(id, employeeData) {
    try {
      const db = await getDatabase();
      const { name, email, position } = employeeData;
      
      // Check if employee exists first
      const existsResult = db.exec('SELECT COUNT(*) as count FROM employees WHERE id = ?', [id]);
      const exists = existsResult.length > 0 && existsResult[0].values[0][0] > 0;
      
      if (!exists) {
        db.close();
        return null;
      }
      
      db.run(`
        UPDATE employees 
        SET name = ?, email = ?, position = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, email, position, id]);
      
      // Get the updated employee
      const result = db.exec('SELECT * FROM employees WHERE id = ?', [id]);
      
      let employee = null;
      if (result.length > 0 && result[0].values.length > 0) {
        const columns = result[0].columns;
        const row = result[0].values[0];
        employee = {};
        columns.forEach((col, i) => {
          employee[col] = row[i];
        });
      }
      
      saveDatabase(db);
      db.close();
      return employee;
    } catch (err) {
      throw err;
    }
  }
  
  // Delete employee
  static async deleteEmployee(id) {
    try {
      const db = await getDatabase();
      
      // Check if employee exists first
      const existsResult = db.exec('SELECT COUNT(*) as count FROM employees WHERE id = ?', [id]);
      const exists = existsResult.length > 0 && existsResult[0].values[0][0] > 0;
      
      if (!exists) {
        db.close();
        return false;
      }
      
      db.run('DELETE FROM employees WHERE id = ?', [id]);
      
      saveDatabase(db);
      db.close();
      return true;
    } catch (err) {
      throw err;
    }
  }
  
  // Check if email exists (for validation)
  static async checkEmailExists(email, excludeId = null) {
    try {
      const db = await getDatabase();
      let query = 'SELECT id FROM employees WHERE email = ?';
      let params = [email];
      
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
      
      const result = db.exec(query, params);
      const exists = result.length > 0 && result[0].values.length > 0;
      
      db.close();
      return exists;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = EmployeeService;