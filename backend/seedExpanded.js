const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Product = require('./models/Product');
const User = require('./models/User');
const expandedProducts = require('./data/expandedProducts');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing products...'.yellow);
    await Product.deleteMany();
    console.log('✅ Products cleared'.green);

    // Create admin user if doesn't exist
    let adminUser = await User.findOne({ email: 'admin@fancy.com' });
    if (!adminUser) {
      console.log('👤 Creating admin user...'.yellow);
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@fancy.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created'.green);
    } else {
      console.log('👤 Admin user already exists'.blue);
    }

    // Add unique timestamps and user ID to each product for cache busting
    const productsWithTimestamps = expandedProducts.map((product, index) => {
      const timestamp = Date.now() + index * 1000;
      return {
        ...product,
        user: adminUser._id,
        images: product.images.map((img, imgIndex) => ({
          ...img,
          url: img.url + `&cachebust=${timestamp}${imgIndex}`
        }))
      };
    });

    // Insert expanded products
    console.log('📦 Inserting expanded product collection...'.yellow);
    const insertedProducts = await Product.insertMany(productsWithTimestamps);
    console.log(`✅ ${insertedProducts.length} products inserted`.green);

    // Print summary
    console.log('\n📊 PRODUCT SUMMARY:'.cyan.bold);
    const menProducts = await Product.countDocuments({ gender: 'Men' });
    const womenProducts = await Product.countDocuments({ gender: 'Women' });
    const topWear = await Product.countDocuments({ category: 'Top Wear' });
    const bottomWear = await Product.countDocuments({ category: 'Bottom Wear' });
    const accessories = await Product.countDocuments({ category: 'Accessories' });
    const footwear = await Product.countDocuments({ category: 'Footwear' });

    console.log(`👨 Men's Products: ${menProducts}`.cyan);
    console.log(`👩 Women's Products: ${womenProducts}`.cyan);
    console.log(`👔 Top Wear: ${topWear}`.cyan);
    console.log(`👖 Bottom Wear: ${bottomWear}`.cyan);
    console.log(`👜 Accessories: ${accessories}`.cyan);
    console.log(`👟 Footwear: ${footwear}`.cyan);
    console.log(`📦 Total Products: ${insertedProducts.length}`.cyan.bold);

    console.log('\n🎉 Data Imported Successfully!'.green.bold);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!'.red);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
