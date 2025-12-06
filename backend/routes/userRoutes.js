// we need a router from express, so create express, import model,

const express = require("express");
const User = require("../models/User");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");
const { authLimiter } = require("../middleware/security");
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

module.exports = router;
