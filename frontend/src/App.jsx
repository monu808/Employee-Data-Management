import React, { useState, useEffect } from 'react';
import EmployeeService from './services/employeeService';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';
import './styles/App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load employees on component mount and when search term changes
  useEffect(() => {
    loadEmployees();
  }, [searchTerm]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await EmployeeService.getAllEmployees(searchTerm);
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees. Please check if the server is running.');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      setError('');
      await EmployeeService.deleteEmployee(id);
      // Reload employees after successful deletion
      await loadEmployees();
    } catch (err) {
      setError('Failed to delete employee. Please try again.');
      console.error('Error deleting employee:', err);
    }
  };

  const handleFormSubmit = async (employeeData) => {
    try {
      setIsSubmitting(true);
      setError('');

      if (editingEmployee) {
        // Update existing employee
        await EmployeeService.updateEmployee(editingEmployee.id, employeeData);
      } else {
        // Create new employee
        await EmployeeService.createEmployee(employeeData);
      }

      // Close form and reload employees
      setShowForm(false);
      await loadEmployees();
    } catch (err) {
      setError(err.message || 'Failed to save employee. Please try again.');
      console.error('Error saving employee:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>Employee Data Management</h1>
          <p>Manage your employee information efficiently</p>
        </header>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button 
              className="error-close" 
              onClick={() => setError('')}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

        <div className="main-content">
          <div className="toolbar">
            <SearchBar onSearch={handleSearch} />
            <button 
              className="btn btn-primary add-employee-btn"
              onClick={handleAddEmployee}
            >
              <span className="btn-icon">+</span>
              Add Employee
            </button>
          </div>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading employees...</p>
            </div>
          ) : (
            <EmployeeList
              employees={employees}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              searchTerm={searchTerm}
            />
          )}
        </div>

        {/* Modal for Add/Edit Employee Form */}
        {showForm && (
          <Modal
            title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            onClose={handleFormCancel}
          >
            <EmployeeForm
              employee={editingEmployee}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isSubmitting={isSubmitting}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}

export default App;