// API Base URL - change this to match your backend server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

class EmployeeService {
  static async getAllEmployees(searchTerm = '') {
    try {
      const url = searchTerm 
        ? `${API_BASE_URL}/api/employees?search=${encodeURIComponent(searchTerm)}`
        : `${API_BASE_URL}/api/employees`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }
  
  static async getEmployeeById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Employee not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }
  
  static async createEmployee(employeeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }
  
  static async updateEmployee(id, employeeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }
  
  static async deleteEmployee(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }
}

export default EmployeeService;