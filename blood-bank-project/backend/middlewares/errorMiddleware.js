class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Mark as operational error (known error)

    // Maintain proper stack trace (only needed in V8 engines like Node.js)
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // Default values if not set
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle specific error types
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value (${field}) Entered`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is Invalid, Try Again";
    err = new ErrorHandler(message, 401);
  }
  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token is Expired, Try Again";
    err = new ErrorHandler(message, 401);
  }
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}.`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(" ")}`;
    err = new ErrorHandler(message, 400);
  }
  // Development vs Production error response
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

export default ErrorHandler;
