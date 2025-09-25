const { body, validationResult } = require("express-validator");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),
  
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  
  body("password")
    .isLength({ min: 6, max: 128 })
    .withMessage("Password must be between 6 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  
  handleValidationErrors,
];

// User login validation
const validateUserLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  
  handleValidationErrors,
];

// Product validation
const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),
  
  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
  
  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be a positive number"),
  
  body("countInStock")
    .isInt({ min: 0 })
    .withMessage("Stock count must be a non-negative integer"),
  
  body("sku")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU must be between 3 and 50 characters")
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage("SKU can only contain uppercase letters, numbers, hyphens, and underscores"),
  
  body("category")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),
  
  body("sizes")
    .isArray({ min: 1 })
    .withMessage("At least one size must be provided"),
  
  body("colors")
    .isArray({ min: 1 })
    .withMessage("At least one color must be provided"),
  
  body("gender")
    .optional()
    .isIn(["Men", "Women", "Unisex"])
    .withMessage("Gender must be Men, Women, or Unisex"),
  
  handleValidationErrors,
];

// Contact form validation
const validateContactForm = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  
  body("subject")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Subject must be between 5 and 200 characters"),
  
  body("message")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters"),
  
  handleValidationErrors,
];

// Newsletter subscription validation
const validateNewsletterSubscription = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  
  handleValidationErrors,
];

// Checkout validation
const validateCheckout = [
  body("checkoutItems")
    .isArray({ min: 1 })
    .withMessage("At least one item must be in the checkout"),
  
  body("shippingAddress.address")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be between 5 and 200 characters"),
  
  body("shippingAddress.city")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("City must be between 2 and 100 characters"),
  
  body("shippingAddress.postalCode")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Postal code must be between 3 and 20 characters"),
  
  body("shippingAddress.country")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Country must be between 2 and 100 characters"),
  
  body("paymentMethod")
    .trim()
    .isIn(["PayPal", "Credit Card", "Stripe"])
    .withMessage("Invalid payment method"),
  
  body("totalPrice")
    .isFloat({ min: 0.01 })
    .withMessage("Total price must be a positive number"),
  
  handleValidationErrors,
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProduct,
  validateContactForm,
  validateNewsletterSubscription,
  validateCheckout,
  handleValidationErrors,
};
