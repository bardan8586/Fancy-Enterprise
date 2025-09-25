const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");
const { asyncHandler } = require("../middleware/errorHandler");
const { contactLimiter } = require("../middleware/security");
const { validateNewsletterSubscription } = require("../middleware/validation");

// @route POST /api/subscribe
// @desc Handle newsletter subscription
// @access Public
router.post("/subscribe", contactLimiter, validateNewsletterSubscription, asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if the email is already subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: "email is already subscribed" });
    }

    //  Create a new subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();

    res
      .status(201)
      .json({ message: "Successfully subscribed to the newsletter!" });
  } catch (error) {
    throw error;
  }
}));

module.exports = router;
