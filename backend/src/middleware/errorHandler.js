function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Default error values
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';
  
  // Log error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error stack:', err.stack);
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code: code,
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

module.exports = errorHandler;
