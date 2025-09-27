const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error response
  let error = {
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };
  
  // SQLite constraint errors
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    error.message = 'A record with this information already exists';
    error.statusCode = 409;
  }
  
  // SQLite foreign key constraint
  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    error.message = 'Cannot perform this operation due to related records';
    error.statusCode = 400;
  }
  
  // SQLite database errors
  if (err.code && err.code.startsWith('SQLITE_')) {
    error.message = 'Database operation failed';
    error.statusCode = 500;
  }
  
  // Validation errors (express-validator)
  if (err.type === 'entity.parse.failed') {
    error.message = 'Invalid JSON format';
    error.statusCode = 400;
  }
  
  // Request entity too large
  if (err.type === 'entity.too.large') {
    error.message = 'Request body too large';
    error.statusCode = 413;
  }
  
  // Cast errors (invalid ID format)
  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    error.statusCode = 400;
  }
  
  const statusCode = error.statusCode || err.statusCode || 500;
  
  res.status(statusCode).json(error);
};

module.exports = errorHandler;