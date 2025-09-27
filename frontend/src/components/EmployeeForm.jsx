import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ employee, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Initialize form data when employee prop changes
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        position: employee.position || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        position: ''
      });
    }
    setErrors({});
    setTouched({});
  }, [employee]);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (value.trim().length > 100) {
          error = 'Name must not exceed 100 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          error = 'Name can only contain letters, spaces, apostrophes, and hyphens';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address';
        } else if (value.trim().length > 255) {
          error = 'Email must not exceed 255 characters';
        }
        break;

      case 'position':
        if (!value.trim()) {
          error = 'Position is required';
        } else if (value.trim().length < 2) {
          error = 'Position must be at least 2 characters';
        } else if (value.trim().length > 100) {
          error = 'Position must not exceed 100 characters';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate field on change if it was previously touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate entire form
    const formErrors = validateForm();
    setErrors(formErrors);

    // If no errors, submit form
    if (Object.keys(formErrors).length === 0) {
      const trimmedData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        position: formData.position.trim()
      };
      onSubmit(trimmedData);
    }
  };

  const isValid = Object.keys(validateForm()).length === 0;

  return (
    <form onSubmit={handleSubmit} className="employee-form" noValidate>
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Full Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${errors.name ? 'error' : ''}`}
          placeholder="Enter employee's full name"
          disabled={isSubmitting}
          autoComplete="name"
        />
        {errors.name && (
          <span className="error-text">{errors.name}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email Address <span className="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="Enter employee's email address"
          disabled={isSubmitting}
          autoComplete="email"
        />
        {errors.email && (
          <span className="error-text">{errors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="position" className="form-label">
          Position <span className="required">*</span>
        </label>
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${errors.position ? 'error' : ''}`}
          placeholder="Enter employee's position"
          disabled={isSubmitting}
          autoComplete="organization-title"
        />
        {errors.position && (
          <span className="error-text">{errors.position}</span>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <>
              <span className="loading-spinner small"></span>
              {employee ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            employee ? 'Update Employee' : 'Create Employee'
          )}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;