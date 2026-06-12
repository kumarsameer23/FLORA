require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Category = require('../src/models/Category.model');
const Product = require('../src/models/Product.model');

const check = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to DB');

  const cats = await Category.find().lean();
  console.log('\n📁 CATEGORIES IN DB:');
  cats.forEach(c => {
    console.log(`   - Name: "${c.name}", Slug: "${c.slug}", ID: ${c._id}`);
  });

  const products = await Product.find().lean();
  console.log('\n🌿 PRODUCTS IN DB:');
  products.forEach(p => {
    console.log(`   - Name: "${p.name}", Category Ref ID: ${p.category}, Slug: "${p.slug}"`);
  });

  await mongoose.disconnect();
};

check();
