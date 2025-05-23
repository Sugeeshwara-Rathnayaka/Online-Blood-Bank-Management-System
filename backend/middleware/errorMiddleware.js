class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Marks the error as operational (for easier debugging in production)
  }
}
// Middleware to handle errors
export const errorMiddleware = (err, req, res, next) => {
  // Set default values for message and statusCode if not provided
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle specific error cases
  if (err.code === 11000) {
    // Duplicate key error (MongoDB)
    const field = Object.keys(err.keyValue)[0];
    const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
    err = new ErrorHandler(`${formattedField} already exists`, 409);
  }

  if (err.name === "JsonWebTokenError") {
    // Invalid JWT error
    err = new ErrorHandler("Json Web Token is Invalid, Try Again", 400);
  }

  if (err.name === "TokenExpiredError") {
    // Expired JWT error
    err = new ErrorHandler("Json Web Token is Expired, Try Again", 400);
  }

  if (err.name === "CastError") {
    // Invalid ObjectId error (MongoDB)
    err = new ErrorHandler(`Invalid ${err.path}`, 400);
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message);
    err = new ErrorHandler(`Validation failed: ${messages.join(", ")}`, 400);
  }

  // Log the error for debugging purposes (in development mode)
  console.error(err);

  // Send the error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined, // Include stack trace in development
  });
};
export default ErrorHandler;
