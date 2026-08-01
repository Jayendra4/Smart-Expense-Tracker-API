class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    // Captures the stack trace, omitting the constructor call itself
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
