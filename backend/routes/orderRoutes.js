const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");

const router = express.Router();

// @route GET /api/orders/my-orders
// @desc Get user's orders
// @access Private
router.get("/my-orders", protect, asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.productId', 'name price images')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}));

// @route GET /api/orders/:id
// @desc Get order by ID
// @access Private
router.get("/:id", protect, asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.productId', 'name price images')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order belongs to user (unless admin)
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
}));

// @route POST /api/orders
// @desc Create new order
// @access Private
router.post("/", protect, asyncHandler(async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice = 0,
      taxPrice = 0,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
}));

module.exports = router;


