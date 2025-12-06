const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const products = require("./data/product");
const Cart = require("./models/Cart");

dotenv.config();

// Use local MongoDB for development
const LOCAL_MONGODB_URI = "mongodb://localhost:27017/ecommerce";

// Connect to local mongoDB
mongoose.connect(LOCAL_MONGODB_URI);

// Function to seed data
const seedData = async () => {
  try {
    console.log("🌱 Starting to seed local database...");
    
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    console.log("✅ Cleared existing data");

    // Create a default admin User
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });
    console.log("✅ Created admin user:", createdUser.email);

    // Assign the default user ID to each product
    const userID = createdUser._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });

    // Insert the products into the database
    await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${sampleProducts.length} products`);

    console.log("\n🎉 Local database seeded successfully!");
    console.log("\n📝 Admin credentials:");
    console.log("   Email: admin@example.com");
    console.log("   Password: 123456");
    console.log("\n");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding the data:", error);
    process.exit(1);
  }
};

seedData();
