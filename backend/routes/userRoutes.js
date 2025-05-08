// we need a router from express, so create express, import model,

const express = require("express");
const User = require("../models/User");
//const User = require("../models/User");
const router = express.Router();

const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

// @route POST /api/users/register
// @desc Register a new user
// @access Public

router.post("/register", async (req, res) => {
  console.log("Request received at /register"); // Log when the route is hit
  console.log("Request body:", req.body); // Log the incoming request body
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User Already exists" });

    user = new User({ name, email, password });
    console.log(user, "user");
    //return;
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
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// @route POST /api/users/login
// @desc Authenticate user
// @access Public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

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
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
