require('dotenv').config();

const connectDB = require('./src/config/db');
const Product = require('./src/models/Product');
const seedProducts = require('./src/utils/seedProducts');

const run = async () => {
  try {
    await connectDB();

    // Clear and seed
    await Product.deleteMany({});
    const created = await Product.insertMany(seedProducts);

    console.log(`Seed complete: ${created.length} products added.`);
    process.exit(0);
  } catch (err) {
    console.error(`Seed failed: ${err.message}`);
    process.exit(1);
  }
};

run();
