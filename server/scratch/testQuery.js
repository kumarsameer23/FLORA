require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Category = require('../src/models/Category.model');
const Product = require('../src/models/Product.model');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected');

  const category = 'indoor-plants';
  const query = { isActive: true };

  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    } else {
      const foundCategory = await Category.findOne({ slug: category });
      if (foundCategory) {
        query.category = foundCategory._id;
        console.log(`Found category by slug "${category}": ${foundCategory.name} (${foundCategory._id})`);
      } else {
        query.category = new mongoose.Types.ObjectId();
        console.log(`Category slug "${category}" not found!`);
      }
    }
  }

  console.log('Query:', query);
  const products = await Product.find(query)
    .populate('category', 'name slug icon')
    .lean();

  console.log(`Products found: ${products.length}`);
  products.forEach(p => console.log(` - ${p.name}`));

  await mongoose.disconnect();
};

run();
