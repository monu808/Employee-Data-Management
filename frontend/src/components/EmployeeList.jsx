import React from 'react';

const EmployeeList = ({ employees, onEdit, onDelete, searchTerm }) => {
  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👥</div>
        <h3>No employees found</h3>
        <p>
          {searchTerm 
            ? `No employees match "${searchTerm}". Try a different search term.`
            : 'Get started by adding your first employee.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="employee-list">
      <div className="list-header">
        <h2>
          Employees 
          <span className="employee-count">({employees.length})</span>
        </h2>
        {searchTerm && (
          <p className="search-info">
            Showing results for "{searchTerm}"
          </p>
        )}
      </div>

      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <EmployeeRow
                key={employee.id}
                employee={employee}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmployeeRow = ({ employee, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <tr className="employee-row">
      <td className="employee-name">
        <div className="name-cell">
          <div className="avatar">
            {employee.name.charAt(0).toUpperCase()}
          </div>
          <span>{employee.name}</span>
        </div>
      </td>
      <td className="employee-email">
        <a href={`mailto:${employee.email}`} className="email-link">
          {employee.email}
        </a>
      </td>
      <td className="employee-position">
        <span className="position-badge">
          {employee.position}
        </span>
      </td>
      <td className="employee-date">
        {formatDate(employee.created_at)}
      </td>
      <td className="employee-actions">
        <div className="action-buttons">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(employee)}
            title="Edit employee"
          >
            <span className="btn-icon">✏️</span>
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(employee.id)}
            title="Delete employee"
          >
            <span className="btn-icon">🗑️</span>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default EmployeeList;