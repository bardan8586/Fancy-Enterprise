const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load environment variables first
dotenv.config();

const connectDB = require("./config/db");

// Import middleware
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { 
  generalLimiter, 
  securityHeaders, 
  sanitizeInput 
} = require("./middleware/security");

// Import routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const subscribeRoutes = require("./routes/subscribeRoute");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Trust proxy for accurate IP addresses
app.set("trust proxy", 1);

// Security middleware
app.use(securityHeaders);

// Request logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:5173", // Vite default
      "http://localhost:3000", // React default
      "http://localhost:5174", // Vite alternate
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ].filter(Boolean); // Remove undefined values

    // In production, be more strict - only allow configured FRONTEND_URL
    if (process.env.NODE_ENV === "production") {
      const productionOrigin = process.env.FRONTEND_URL;
      if (!productionOrigin) {
        console.error("❌ ERROR: FRONTEND_URL is required in production!");
        return callback(new Error("Server misconfiguration: FRONTEND_URL not set"));
      }
      if (origin === productionOrigin) {
        return callback(null, true);
      }
      // Reject all other origins in production
      return callback(new Error("Not allowed by CORS"));
    }

    // In development, allow all common localhost origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // For development, also allow any localhost origin for flexibility
    if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
      return callback(null, true);
    }

    // If origin doesn't match, reject it
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Cache control middleware - disable caching for API routes
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Input sanitization
app.use(sanitizeInput);

// General rate limiting
app.use(generalLimiter);

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Fancy API!");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/upload", uploadRoutes);

// 404 handler for unknown routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV || "development"} mode
📍 URL: http://localhost:${PORT}
🏥 Health check: http://localhost:${PORT}/health
⏰ Started at: ${new Date().toISOString()}
  `);
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});
