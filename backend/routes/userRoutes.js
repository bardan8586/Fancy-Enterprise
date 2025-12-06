// we need a router from express, so create express, import model,

const express = require("express");
const User = require("../models/User");
const router = express.Router();

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { protect } = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");
const { authLimiter } = require("../middleware/security");
const { 
  validateUserRegistration, 
  validateUserLogin 
} = require("../middleware/validation");
const { sendPasswordResetEmail } = require("../services/gmailService");

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
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({
    success: true,
    user,
  });
}));

// @route POST /api/users/google-auth
// @desc Authenticate user with Google
// @access Public
router.post("/google-auth", authLimiter, asyncHandler(async (req, res) => {
  const { tokenId } = req.body;

  if (!tokenId) {
    return res.status(400).json({ message: "Google token is required" });
  }

  try {
    // Verify Google token
    const { OAuth2Client } = require("google-auth-library");
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists with this email
    let user = await User.findOne({ email });

    if (user) {
      // User exists - check if they have Google ID
      if (!user.googleId) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.provider = "google";
        await user.save();
      } else if (user.googleId !== googleId) {
        return res.status(400).json({ 
          message: "This email is already associated with another Google account" 
        });
      }
    } else {
      // Create new user with Google
      user = new User({
        name,
        email,
        googleId,
        provider: "google",
        role: "customer",
      });
      await user.save();
    }

    // Create JWT payload
    const jwtPayload = { user: { id: user._id, role: user.role } };

    // Sign and return the token
    jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET,
      { expiresIn: "45h" },
      (err, token) => {
        if (err) throw err;

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
    console.error("Google auth error:", error);
    if (error.message && error.message.includes("Invalid token")) {
      return res.status(400).json({ message: "Invalid Google token" });
    }
    throw error;
  }
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
    },
  });
}));

// @route POST /api/users/wishlist
// @desc Add product to wishlist
// @access Private
router.post("/wishlist", protect, asyncHandler(async (req, res) => {
  const { productId } = req.body;
  
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if product is already in wishlist
  if (user.wishlist.includes(productId)) {
    return res.status(400).json({ message: "Product already in wishlist" });
  }

  // Add product to wishlist
  user.wishlist.push(productId);
  await user.save();

  // Populate wishlist with product details
  await user.populate("wishlist");

  res.json({
    success: true,
    message: "Product added to wishlist",
    wishlist: user.wishlist,
  });
}));

// @route DELETE /api/users/wishlist/:productId
// @desc Remove product from wishlist
// @access Private
router.delete("/wishlist/:productId", protect, asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Remove product from wishlist
  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== productId
  );
  await user.save();

  // Populate wishlist with product details
  await user.populate("wishlist");

  res.json({
    success: true,
    message: "Product removed from wishlist",
    wishlist: user.wishlist,
  });
}));

// @route GET /api/users/wishlist
// @desc Get user's wishlist
// @access Private
router.get("/wishlist", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    success: true,
    wishlist: user.wishlist || [],
  });
}));

// @route POST /api/users/forgot-password
// @desc Send password reset email
// @access Public
router.post("/forgot-password", authLimiter, asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: "If that email exists, we've sent password reset instructions.",
      });
    }

    // Don't allow password reset for Google users
    if (user.provider === "google") {
      return res.status(400).json({
        message: "This account uses Google Sign-In. Please sign in with Google.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email
    try {
      await sendPasswordResetEmail(email, resetToken, user.name);
      res.json({
        success: true,
        message: "Password reset instructions sent to your email",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Clear token if email fails
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      
      return res.status(500).json({
        message: "Failed to send email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
}));

// @route POST /api/users/reset-password/:token
// @desc Reset password with token
// @access Public
router.post("/reset-password/:token", authLimiter, asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
}));

module.exports = router;
