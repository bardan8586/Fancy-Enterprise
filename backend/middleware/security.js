const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil(windowMs / 1000),
      });
    },
  });
};

// General API rate limiting
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  "Too many requests from this IP, please try again later"
);

// Strict rate limiting for auth endpoints
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  "Too many authentication attempts, please try again later"
);

// Payment rate limiting
const paymentLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  10, // limit each IP to 10 payment requests per windowMs
  "Too many payment attempts, please try again later"
);

// Contact form rate limiting
const contactLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  3, // limit each IP to 3 contact form submissions per hour
  "Too many contact form submissions, please try again later"
);

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.paypal.com", "https://www.paypal.com"],
      frameSrc: ["'self'", "https://www.paypal.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for PayPal integration
});

// IP whitelist for admin operations (optional)
const adminIPWhitelist = (req, res, next) => {
  const allowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(",") || [];
  
  if (allowedIPs.length === 0) {
    // If no whitelist is configured, allow all (development mode)
    return next();
  }
  
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (allowedIPs.includes(clientIP)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied: IP not authorized for admin operations",
    });
  }
};

// Request sanitization
const sanitizeInput = (req, res, next) => {
  // Remove any HTML tags from string inputs
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key].replace(/<[^>]*>/g, "").trim();
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
};

module.exports = {
  generalLimiter,
  authLimiter,
  paymentLimiter,
  contactLimiter,
  securityHeaders,
  adminIPWhitelist,
  sanitizeInput,
};
