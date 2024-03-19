class AppError extends Error {
  constructor(message, statusCode) {
    // When we extend a parent class, we call super() in order to call the parent constructor
    // And then we call it with "message", because that's what the parent class Error accepts
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
    // We use this to differentiate operation errors from other errors
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
