const mongoose = require("mongoose");

// Enhanced error logging
const logError = (error, req) => {
  const timestamp = new Date().toISOString();
  const userInfo = req.user ? `User: ${req.user._id}` : "Guest";
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.error(`
================== ERROR LOG ==================
Timestamp: ${timestamp}
${userInfo}
Method: ${method} ${url}
IP: ${ip}
Error: ${error.message}
Stack: ${error.stack}
===============================================
  `);
};

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  logError(err, req);

  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message).join(", ");
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = { message, statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = { message, statusCode: 401 };
  }

  // PayPal/Payment errors
  if (err.name === "PayPalError") {
    const message = "Payment processing failed";
    error = { message, statusCode: 402 };
  }

  // Default error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 handler for unknown routes
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Async handler to avoid try-catch blocks
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  logError,
};
