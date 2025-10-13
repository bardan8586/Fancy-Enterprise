const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");
const { paymentLimiter } = require("../middleware/security");
const { validateCheckout } = require("../middleware/validation");

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/", protect, paymentLimiter, asyncHandler(async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "no items in checkout" });
  }

  // Basic validation
  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || 
      !shippingAddress.postalCode || !shippingAddress.country) {
    return res.status(400).json({ message: "Complete shipping address is required" });
  }
  
  if (!paymentMethod || !["PayPal", "Credit Card", "Stripe"].includes(paymentMethod)) {
    return res.status(400).json({ message: "Valid payment method is required" });
  }
  
  if (!totalPrice || totalPrice <= 0) {
    return res.status(400).json({ message: "Valid total price is required" });
  }

  try {
    // Ensure all checkout items have required fields, especially image
    const enrichedCheckoutItems = await Promise.all(
      checkoutItems.map(async (item) => {
        // If image is missing, fetch it from the product
        if (!item.image) {
          const product = await Product.findById(item.productId);
          if (product && product.images && product.images.length > 0) {
            item.image = product.images[0].url;
          } else {
            // Fallback image if product doesn't have images
            item.image = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80";
          }
        }
        
        // Ensure other required fields
        if (!item.name) item.name = "Product";
        if (!item.price) item.price = 0;
        if (!item.quantity) item.quantity = 1;
        
        return item;
      })
    );

    // Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: enrichedCheckoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });
    res.status(201).json(newCheckout);
  } catch (error) {
    throw error;
  }
}));

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      // Create final order based on the checkout details
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      //   Mark the checkout as finalized
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();
      //   Delete the cart associated with the user
      await Cart.findOneAndDelete({ user: checkout.user });
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "Checkout already finalized" });
    } else {
      res.status(400).json({ message: "Checkout is not paid" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
