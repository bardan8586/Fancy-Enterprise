// we need a router from express, so create express, import model,

const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");
const { authLimiter } = require("../middleware/security");
const { sendPasswordResetEmail, sendWelcomeEmail } = require("../services/gmailService");
const { 
  validateUserRegistration, 
  validateUserLogin 
} = require("../middleware/validation");

// @route POST /api/users/register
// @desc Register a new user
// @access Public

router.post("/register", authLimiter, validateUserRegistration, asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User Already exists" });

    user = new User({ name, email, password });
    await user.save(); //it saves the data into mongodb datbase as a User Collection

    // Send welcome email (non-blocking)
    if (process.env.NODE_ENV === 'production') {
      sendWelcomeEmail(user.email, user.name).catch(err => 
        console.error('Welcome email failed:', err)
      );
    }

    //create JWT payload
    const payload = { user: { id: user._id, role: user.role } };

    //Sign and return the token along with the user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "45h" },
      (err, token) => {
        if (err) throw err;

        //Send the user and token in response and create a JWT token
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    throw error; // Let the global error handler deal with it
  }
}));

// @route POST /api/users/login
// @desc Authenticate user
// @access Public

router.post("/login", authLimiter, validateUserLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "User doesn't exist!",
      });

    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    //create JWT payload
    const payload = { user: { id: user._id, role: user.role } };

    //Sign and return the token along with the user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "45h" },
      (err, token) => {
        if (err) throw err;

        //Send the user and token in response and create a JWT token
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            wishlist: user.wishlist || [],
          },
          token,
        });
      }
    );
  } catch (error) {
    throw error; // Let the global error handler deal with it
  }
}));

// @route GET /api/users/profile
// @desc Get user profile
// @access Private
router.get("/profile", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password").populate("wishlist");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({
    success: true,
    user,
  });
}));

// @route PUT /api/users/profile
// @desc Update user profile
// @access Private
router.put("/profile", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update only provided fields
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      wishlist: updatedUser.wishlist || [],
    },
  });
}));

// @route GET /api/users/wishlist
// @desc Get logged in user's wishlist (full product details)
// @access Private
router.get(
  "/wishlist",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      items: user.wishlist || [],
    });
  })
);

// @route POST /api/users/wishlist/:productId
// @desc Add product to wishlist
// @access Private
router.post(
  "/wishlist/:productId",
  protect,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyInWishlist = user.wishlist?.some(
      (pId) => pId.toString() === productId
    );

    if (!alreadyInWishlist) {
      user.wishlist = [...(user.wishlist || []), productId];
      await user.save();
    }

    const populatedUser = await User.findById(req.user._id).populate("wishlist");

    res.status(200).json({
      success: true,
      message: "Added to wishlist",
      items: populatedUser.wishlist || [],
    });
  })
);

// @route DELETE /api/users/wishlist/:productId
// @desc Remove product from wishlist
// @access Private
router.delete(
  "/wishlist/:productId",
  protect,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = (user.wishlist || []).filter(
      (pId) => pId.toString() !== productId
    );
    await user.save();

    const populatedUser = await User.findById(req.user._id).populate("wishlist");

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      items: populatedUser.wishlist || [],
    });
  })
);

// @route POST /api/users/forgot-password
// @desc Send password reset email
// @access Public
router.post("/forgot-password", authLimiter, asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });
  
  if (!user) {
    // Don't reveal if email exists or not (security)
    return res.status(200).json({ 
      message: "If an account with that email exists, a password reset link has been sent." 
    });
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send password reset email
  try {
    if (process.env.NODE_ENV === 'development') {
      // In development, log the reset URL to console
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
      console.log(`\n🔐 Password Reset URL for ${email}:`);
      console.log(`📧 ${resetUrl}`);
      console.log(`⏰ Expires in 15 minutes\n`);
    } else {
      // In production, send actual email
      await sendPasswordResetEmail(user.email, resetToken, user.name);
    }
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
    // Don't fail the request if email fails, just log it
  }

  res.status(200).json({ 
    message: "If an account with that email exists, a password reset link has been sent." 
  });
}));

// @route POST /api/users/reset-password/:token
// @desc Reset password with token
// @access Public
router.post("/reset-password/:token", authLimiter, asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  // Hash the token to compare with stored hash
  const crypto = require('crypto');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with valid token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  // Update password and clear reset token
  user.password = password;
  user.clearPasswordResetToken();
  await user.save();

  res.status(200).json({ 
    message: "Password has been reset successfully" 
  });
}));

module.exports = router;
