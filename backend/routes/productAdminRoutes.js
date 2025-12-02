const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route POST /api/admin/products
// @desc Create a new product (Admin only)
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      isFeatured,
      isPublished,
      images
    } = req.body;

    // Validation
    if (!name || !description || !price || !sku || !category) {
      return res.status(400).json({ 
        message: "Please provide all required fields: name, description, price, sku, category" 
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ message: "A product with this SKU already exists" });
    }

    // Create product data object
    const productData = {
      name,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      countInStock: parseInt(countInStock) || 0,
      sku,
      category,
      brand: brand || "",
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ["One Size"],
      colors: Array.isArray(colors) && colors.length > 0 ? colors : ["Default"],
      collections: collections || "General",
      material: material || "",
      isFeatured: isFeatured || false,
      isPublished: isPublished !== undefined ? isPublished : true,
      images: images || [],
      user: req.user._id
    };

    // Only add gender if it has a value
    if (gender && gender.trim()) {
      productData.gender = gender;
    }

    const product = new Product(productData);

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });
  }
});

// @route PUT /api/admin/products/:id
// @desc Update a product (Admin only)
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      isFeatured,
      isPublished,
      images
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if SKU is being changed and if it already exists
    if (sku && sku !== product.sku) {
      const existingProduct = await Product.findOne({ sku });
      if (existingProduct) {
        return res.status(400).json({ message: "A product with this SKU already exists" });
      }
    }

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? parseFloat(price) : product.price;
    product.discountPrice = discountPrice !== undefined ? parseFloat(discountPrice) : product.discountPrice;
    product.countInStock = countInStock !== undefined ? parseInt(countInStock) : product.countInStock;
    product.sku = sku || product.sku;
    product.category = category || product.category;
    product.brand = brand !== undefined ? brand : product.brand;
    product.sizes = sizes !== undefined ? sizes : product.sizes;
    product.colors = colors !== undefined ? colors : product.colors;
    product.collections = collections !== undefined ? collections : product.collections;
    product.material = material !== undefined ? material : product.material;
    product.gender = gender !== undefined ? gender : product.gender;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
    product.images = images !== undefined ? images : product.images;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route DELETE /api/admin/products/:id
// @desc Delete a product (Admin only)
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
