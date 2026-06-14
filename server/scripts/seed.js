require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const User = require('../src/models/User.model');
const Category = require('../src/models/Category.model');
const Product = require('../src/models/Product.model');
const Review = require('../src/models/Review.model');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
};

const categories = [
  { name: 'Indoor Plants', slug: 'indoor-plants', icon: '🏠', color: '#2a5c3f', description: 'Perfect for brightening your home interiors', sortOrder: 1 },
  { name: 'Outdoor Plants', slug: 'outdoor-plants', icon: '🌳', color: '#163320', description: 'Transform your garden and outdoor spaces', sortOrder: 2 },
  { name: 'Flowering Plants', slug: 'flowering-plants', icon: '🌸', color: '#c9a84c', description: 'Add color and fragrance with beautiful blooms', sortOrder: 3 },
  { name: 'Succulents', slug: 'succulents', icon: '🌵', color: '#5a8a6a', description: 'Low-maintenance beauties for any space', sortOrder: 4 },
];

const getProducts = (catMap) => [
  {
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    slug: 'monstera-deliciosa',
    shortDescription: 'The iconic split-leaf houseplant. Air-purifying and dramatic — perfect for bright living rooms.',
    description: 'The Swiss Cheese Plant, or Monstera Deliciosa, is loved by designers worldwide. Thrives in bright indirect light and purifies air naturally.',
    price: 200,
    originalPrice: 200,
    discount: 0,
    images: [{ url: '/uploads/monstera-deliciosa.jpg', alt: 'Monstera Deliciosa' }],
    thumbnail: '/uploads/monstera-deliciosa.jpg',
    category: catMap['indoor-plants'],
    badges: ['Bestseller'],
    stock: 15,
    isFeatured: true,
    isBestSeller: true,
    specs: {
      height: 'Medium pot', potSize: '6 inch', waterRequirement: '💧 Weekly',
      sunlight: '☀️ Indirect', difficulty: 'Beginner', placement: 'Indoor',
      airPurifying: true, petFriendly: false,
    },
    careInstructions: [
      { step: 1, title: 'Watering', description: 'Water thoroughly once a week in summer. Allow the top 2 inches of soil to dry out between watering. Reduce to once every 2 weeks in winter.' },
      { step: 2, title: 'Light', description: 'Thrives in bright, indirect sunlight. Avoid direct afternoon sun which can scorch the leaves. A north or east facing window is ideal.' },
      { step: 3, title: 'Soil & Repotting', description: 'Use well-draining potting mix. Repot every 1–2 years in spring when roots start coming out of the drainage holes.' },
      { step: 4, title: 'Humidity & Temperature', description: 'Loves humidity. Mist leaves weekly or place on a pebble tray with water. Keep between 18–30°C and away from cold drafts.' },
      { step: 5, title: 'Fertilizing', description: 'Feed with a balanced liquid fertilizer once a month during spring and summer. No feeding needed in winter.' },
    ],
  },
  {
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    slug: 'peace-lily',
    shortDescription: 'Elegant white blooms and glossy leaves. Thrives in low light — ideal for offices and bedrooms.',
    description: 'Beautiful air-purifier plant that produces lovely white blooms. Tolerates low light levels.',
    price: 200,
    originalPrice: 200,
    discount: 0,
    images: [{ url: '/uploads/peace-lily.jpg', alt: 'Peace Lily' }],
    thumbnail: '/uploads/peace-lily.jpg',
    category: catMap['indoor-plants'],
    badges: ['Low Maintenance'],
    stock: 20,
    isFeatured: true,
    specs: {
      height: 'Small pot', potSize: '5 inch', waterRequirement: '💧 Twice/week',
      sunlight: '🌤 Low light', difficulty: 'Beginner', placement: 'Indoor',
      airPurifying: true, petFriendly: false,
    },
    careInstructions: [
      { step: 1, title: 'Watering', description: 'Keep soil consistently moist but not waterlogged. Water 2–3 times a week in summer and reduce in winter. Drooping leaves is a sign it needs water.' },
      { step: 2, title: 'Light', description: 'One of the best low-light plants! Place in indirect light or a shaded spot. Avoid direct sunlight which causes leaf burn.' },
      { step: 3, title: 'Humidity', description: 'Loves humid environments. Mist the leaves once or twice a week or keep near a humidifier. Wipe leaves with a damp cloth monthly.' },
      { step: 4, title: 'Fertilizing', description: 'Apply a balanced slow-release fertilizer in spring and once in summer. Over-fertilizing causes brown leaf tips.' },
      { step: 5, title: 'Blooming Tips', description: 'To encourage blooms, move to a brighter spot (still indirect light) in spring. Regular feeding and consistent moisture also help flowering.' },
    ],
  },
  {
    name: 'Jade Plant',
    scientificName: 'Crassula ovata',
    slug: 'jade-plant',
    shortDescription: 'A classic succulent believed to bring good luck. Almost indestructible — great for beginners.',
    description: 'Thick oval leaves and tree-like branching. Perfect as a gift representing prosperity.',
    price: 200,
    originalPrice: 200,
    discount: 0,
    images: [{ url: '/uploads/jade-plant.jpg', alt: 'Jade Plant' }],
    thumbnail: '/uploads/jade-plant.jpg',
    category: catMap['succulents'],
    badges: ['Easy Care'],
    stock: 25,
    isFeatured: true,
    specs: {
      height: 'Small pot', potSize: '4 inch', waterRequirement: '💧 Fortnight',
      sunlight: '☀️ Bright', difficulty: 'Beginner', placement: 'Indoor',
      airPurifying: false, petFriendly: false,
    },
    careInstructions: [
      { step: 1, title: 'Watering', description: 'Water deeply every 2 weeks in summer and once a month in winter. Always let the soil dry completely between watering — overwatering is the #1 killer.' },
      { step: 2, title: 'Light', description: 'Loves 4+ hours of bright sunlight daily. A sunny south or west-facing windowsill is perfect. Can be placed outdoors in summer.' },
      { step: 3, title: 'Soil', description: 'Use a cactus or succulent mix for best drainage. Add perlite for extra aeration. Avoid regular garden soil which retains too much moisture.' },
      { step: 4, title: 'Repotting', description: 'Jade plants like being slightly root-bound. Repot every 2–3 years into a pot just 1–2 inches larger. Spring is the best time.' },
      { step: 5, title: 'Fertilizing', description: 'Feed with a diluted succulent fertilizer once in spring and once in summer. Avoid fertilizing in winter when the plant is resting.' },
    ],
  },
  {
    name: 'Bougainvillea',
    scientificName: 'Bougainvillea spectabilis',
    slug: 'bougainvillea',
    shortDescription: 'Spectacular magenta blooms that last months. Loves full sun and is drought tolerant once established.',
    description: 'A vigorous climbing vine that creates a spectacular showcase of colorful papery bracts in outdoor spaces.',
    price: 200,
    originalPrice: 200,
    discount: 0,
    images: [{ url: '/uploads/bougainvillea.jpg', alt: 'Bougainvillea' }],
    thumbnail: '/uploads/bougainvillea.jpg',
    category: catMap['outdoor-plants'],
    badges: ['Vibrant'],
    stock: 18,
    isFeatured: true,
    specs: {
      height: 'Medium pot', potSize: '8 inch', waterRequirement: '💧 Weekly',
      sunlight: '☀️ Full sun', difficulty: 'Beginner', placement: 'Outdoor',
      airPurifying: false, petFriendly: true,
    },
    careInstructions: [
      { step: 1, title: 'Sunlight', description: 'Needs at least 5–6 hours of direct sunlight per day. Full sun is essential for vibrant blooms. A south-facing wall or terrace is ideal.' },
      { step: 2, title: 'Watering', description: 'Water once a week during dry spells. Allow soil to dry slightly between watering. Actually blooms better with slight water stress — avoid overwatering.' },
      { step: 3, title: 'Pruning', description: 'Prune after each flowering cycle to encourage new growth and more blooms. Remove dead and crossing branches. Wear gloves as stems have thorns.' },
      { step: 4, title: 'Fertilizing', description: 'Feed with a high-phosphorus fertilizer (like NPK 10-30-10) every 3–4 weeks during blooming season to maximize flower production.' },
      { step: 5, title: 'Winter Care', description: 'Reduce watering in cooler months. In Lucknow winters, move potted bougainvillea to a sheltered sunny spot. It may drop leaves but will revive in spring.' },
    ],
  },
  {
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    slug: 'snake-plant',
    shortDescription: "NASA's top air-purifying plant. Nearly indestructible, tolerates neglect, filters toxins overnight.",
    description: 'A staple of low-maintenance indoor gardening. Can thrive in almost any room condition.',
    price: 200,
    originalPrice: 200,
    discount: 0,
    images: [{ url: '/uploads/snake-plant.jpg', alt: 'Snake Plant' }],
    thumbnail: '/uploads/snake-plant.jpg',
    category: catMap['indoor-plants'],
    badges: ['Air Purifier'],
    stock: 30,
    isBestSeller: true,
    isFeatured: true,
    specs: {
      height: 'Medium pot', potSize: '6 inch', waterRequirement: '💧 Monthly',
      sunlight: '🌤 Any light', difficulty: 'Beginner', placement: 'Indoor',
      airPurifying: true, petFriendly: false,
    },
    careInstructions: [
      { step: 1, title: 'Watering', description: 'Water only when soil is completely dry — typically once every 3–4 weeks in summer and once a month or less in winter. Root rot from overwatering is the only way to kill it.' },
      { step: 2, title: 'Light', description: 'Incredibly adaptable — grows in anything from bright sunlight to dim corners. Grows faster with more light but survives with very little.' },
      { step: 3, title: 'Air Purification', description: 'One of NASA\'s top-rated air-purifying plants. Converts CO2 to oxygen at night, making it perfect for bedrooms. Also removes formaldehyde and benzene.' },
      { step: 4, title: 'Repotting', description: 'Only needs repotting every 3–5 years. Snake plants like being root-bound. Use a heavy pot to prevent tipping as it grows tall.' },
      { step: 5, title: 'Propagation', description: 'Easily propagated by leaf cuttings or division. Cut a healthy leaf into sections, let dry for a day, then plant in soil. New plants grow in 4–6 weeks.' },
    ],
  },
  {
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis',
    slug: 'aloe-vera',
    shortDescription: "Nature's first aid kit. Soothing gel for burns and cuts. Thrives on neglect.",
    description: 'Succulent plant containing soothing gel. Very easy to grow on windowsills.',
    price: 200,
    originalPrice: 200,
    discount: 0,
    images: [{ url: '/uploads/aloe-vera.jpg', alt: 'Aloe Vera' }],
    thumbnail: '/uploads/aloe-vera.jpg',
    category: catMap['succulents'],
    badges: ['Medicinal'],
    stock: 50,
    isBestSeller: true,
    specs: {
      height: 'Small pot', potSize: '4 inch', waterRequirement: '💧 Fortnight',
      sunlight: '☀️ Bright', difficulty: 'Beginner', placement: 'Both',
      airPurifying: true, petFriendly: false,
    },
    careInstructions: [
      { step: 1, title: 'Watering', description: 'Water deeply every 2–3 weeks in summer. In winter, once a month is enough. The plant stores water in its thick leaves — overwatering causes root rot.' },
      { step: 2, title: 'Light', description: 'Place in a bright, sunny windowsill (6+ hours of light). Can handle some direct sun outdoors in morning. Avoid dark corners where it will become pale and leggy.' },
      { step: 3, title: 'Gel Harvest', description: 'Cut a thick outer leaf from the base. Stand it cut-side down for 10 minutes to drain the yellow latex (can cause irritation). Then slice open to reveal the pure gel inside.' },
      { step: 4, title: 'Medicinal Use', description: 'Apply fresh aloe gel directly to minor burns, sunburn, and skin irritation for instant cooling relief. It\'s also excellent for hair and scalp care as a natural conditioner.' },
      { step: 5, title: 'Propagation', description: 'Aloe produces "pups" (baby plants) at its base. Wait until pups are at least 2–3 inches tall, then carefully separate and pot individually.' },
    ],
  },
  {
    name: 'Rose Bush',
    scientificName: 'Rosa hybrid',
    slug: 'rose-bush',
    shortDescription: 'Classic garden beauty with fragrant blooms in red, pink, and yellow. A timeless outdoor treasure.',
    description: 'Vibrant outdoor rose bushes that bring beautiful color and wonderful scents to your home garden.',
    price: 200,
    originalPrice: 200,
    discount: 0,
    images: [{ url: '/uploads/rose-bush.avif', alt: 'Rose Bush' }],
    thumbnail: '/uploads/rose-bush.avif',
    category: catMap['flowering-plants'],
    badges: [],
    stock: 20,
    specs: {
      height: 'Large pot', potSize: '8 inch', waterRequirement: '💧 Daily',
      sunlight: '☀️ Full sun', difficulty: 'Intermediate', placement: 'Outdoor',
      airPurifying: false, petFriendly: false,
    },
    careInstructions: [
      { step: 1, title: 'Watering', description: 'Water at the base (not the leaves) every morning. Roses need deep, consistent watering — about 1–2 inches per week. Wet leaves at night can cause fungal disease.' },
      { step: 2, title: 'Sunlight', description: 'Roses need at least 6 hours of direct sunlight per day for best blooming. Morning sun is ideal as it dries the dew quickly.' },
      { step: 3, title: 'Pruning', description: 'Prune to shape after each flush of blooms. Remove dead, diseased, and crossing branches. Cut at a 45° angle above an outward-facing bud to encourage open growth.' },
      { step: 4, title: 'Fertilizing', description: 'Feed with a rose-specific fertilizer or NPK 10-10-10 every 3–4 weeks during the growing season. Start after first bloom and stop 6 weeks before first expected frost.' },
      { step: 5, title: 'Pest Control', description: 'Inspect regularly for aphids, black spot, and powdery mildew. Spray with neem oil solution every 2 weeks as prevention. Remove and discard affected leaves immediately.' },
    ],
  },
  {
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    slug: 'fiddle-leaf-fig',
    shortDescription: 'Large architectural leaves for bold interior statements. The most Instagrammable plant in the world.',
    description: 'Iconic indoor tree with large fiddle-shaped waxy leaves. Thrives in bright indirect light.',
    price: 200,
    originalPrice: 200,
    discount: 0,
    images: [{ url: '/uploads/fiddle-leaf-fig.jpg', alt: 'Fiddle Leaf Fig' }],
    thumbnail: '/uploads/fiddle-leaf-fig.jpg',
    category: catMap['indoor-plants'],
    badges: ['Trending'],
    stock: 8,
    isNewArrival: true,
    specs: {
      height: 'Large pot', potSize: '8 inch', waterRequirement: '💧 Weekly',
      sunlight: '☀️ Bright indirect', difficulty: 'Intermediate', placement: 'Indoor',
      airPurifying: true, petFriendly: false,
    },
    careInstructions: [
      { step: 1, title: 'Location is Everything', description: 'Find a bright spot with indirect light and KEEP IT THERE. Fiddle Leaf Figs hate being moved and will drop leaves in protest. An east or south-facing room works best.' },
      { step: 2, title: 'Watering', description: 'Water once a week in a consistent routine. Check that the top inch of soil is dry first. Use room-temperature water. Inconsistent watering causes brown spots on leaves.' },
      { step: 3, title: 'Humidity & Dusting', description: 'Likes humidity above 50%. Mist weekly or use a humidifier. Wipe large leaves with a damp cloth monthly — dusty leaves block light absorption.' },
      { step: 4, title: 'Feeding', description: 'Feed with a balanced liquid fertilizer diluted to half-strength once a month in spring and summer. Avoid over-fertilizing which causes salt buildup and brown tips.' },
      { step: 5, title: 'Troubleshooting', description: 'Brown spots = underwatering or low humidity. Yellow leaves = overwatering. Dropping leaves = being moved or cold draft. Address the root cause quickly to save your plant.' },
    ],
  },
  {
    name: 'Cactus Trio',
    scientificName: 'Mixed cacti',
    slug: 'cactus-trio',
    shortDescription: 'Three beautiful mini cacti in decorative ceramic pots. Perfect for desktops and windowsills.',
    description: 'Charming trio of distinct dessert cacti. Ideal for bright spaces and requiring very little water.',
    price: 200,
    originalPrice: 200,
    discount: 0,
    images: [{ url: '/uploads/cactus-trio.jpg', alt: 'Cactus Trio' }],
    thumbnail: '/uploads/cactus-trio.jpg',
    category: catMap['succulents'],
    badges: [],
    stock: 30,
    isNewArrival: true,
    specs: {
      height: '3 mini pots', potSize: '3 inch', waterRequirement: '💧 Monthly',
      sunlight: '☀️ Full sun', difficulty: 'Beginner', placement: 'Indoor',
      airPurifying: false, petFriendly: false,
    },
    careInstructions: [
      { step: 1, title: 'Watering', description: 'Water thoroughly once a month in summer and every 6–8 weeks in winter. Pour water slowly at the soil base, never on the body. Empty saucers after 30 minutes to prevent root rot.' },
      { step: 2, title: 'Sunlight', description: 'Place on the sunniest windowsill you have — ideally south or west facing. Cacti love 4–6 hours of direct sunlight. Without enough light they become etiolated (stretched and pale).' },
      { step: 3, title: 'Handling', description: 'Always use thick gloves or fold a newspaper into a thick band when handling spiny cacti. Hold from the base and work quickly to minimize contact with spines.' },
      { step: 4, title: 'Soil & Drainage', description: 'Use a dedicated cactus/succulent mix with excellent drainage. Always use pots with drainage holes. The gravel top-dressing in the pot helps prevent stem rot at the soil level.' },
      { step: 5, title: 'Fertilizing', description: 'Cacti need very little feeding. Apply a diluted cactus fertilizer once in spring. No fertilizer needed in winter when the plants are dormant.' },
    ],
  },
  {
    name: 'Hibiscus',
    scientificName: 'Hibiscus rosa-sinensis',
    slug: 'hibiscus',
    shortDescription: 'Tropical beauty with large showy blooms. Flowers all year in sunny balconies and gardens.',
    description: 'Beautiful flowering plant showing large bell-shaped blossoms. Ideal for sunny garden patches.',
    price: 200,
    originalPrice: 200,
    discount: 0,
    images: [{ url: '/uploads/hibiscus.jpg', alt: 'Hibiscus' }],
    thumbnail: '/uploads/hibiscus.jpg',
    category: catMap['flowering-plants'],
    badges: ['Summer Special'],
    stock: 22,
    isNewArrival: true,
    specs: {
      height: 'Medium pot', potSize: '8 inch', waterRequirement: '💧 Daily',
      sunlight: '☀️ Full sun', difficulty: 'Beginner', placement: 'Outdoor',
      airPurifying: false, petFriendly: true,
    },
    careInstructions: [
      { step: 1, title: 'Sunlight', description: 'Hibiscus thrives in full sun with 6–8 hours of direct light. A south-facing balcony or garden spot is ideal. Insufficient sun reduces blooming dramatically.' },
      { step: 2, title: 'Watering', description: 'Water daily in summer and hot weather — hibiscus is thirsty! Keep the soil moist but not waterlogged. Reduce watering in winter. Wilting leaves signal immediate watering need.' },
      { step: 3, title: 'Fertilizing', description: 'Feed every 2 weeks with a high-potassium fertilizer during blooming season. Avoid high-nitrogen feeds which produce lots of leaves but fewer flowers.' },
      { step: 4, title: 'Pruning', description: 'Prune lightly after each flower flush to encourage bushy growth and more blooms. Remove dead flowers (deadheading) promptly. Major pruning in late winter shapes the plant for spring.' },
      { step: 5, title: 'Hibiscus Tea', description: 'The flowers of Hibiscus rosa-sinensis can be dried and used to make a refreshing ruby-red herbal tea rich in Vitamin C. Simply dry flowers in shade for 3–4 days and steep in hot water.' },
    ],
  },
  {
    name: 'Money Plant',
    scientificName: 'Epipremnum aureum',
    slug: 'money-plant',
    shortDescription: "India's favourite indoor trailing vine, believed to bring luck and prosperity. Grows in soil or water.",
    description: 'Lush golden trailing vine that is nearly impossible to kill. Looks lovely in hanging pots.',
    price: 200,
    originalPrice: 200,
    discount: 0,
    images: [{ url: '/uploads/money-plant.jpg', alt: 'Money Plant' }],
    thumbnail: '/uploads/money-plant.jpg',
    category: catMap['indoor-plants'],
    badges: [],
    stock: 60,
    isBestSeller: true,
    specs: {
      height: 'Small pot', potSize: '4 inch', waterRequirement: '💧 Weekly',
      sunlight: '🌤 Any light', difficulty: 'Beginner', placement: 'Indoor',
      airPurifying: true, petFriendly: false,
    },
    careInstructions: [
      { step: 1, title: 'Watering', description: 'Water once a week in summer when the top inch of soil dries out. In winter, water every 2 weeks. Can also grow directly in a bottle of water — change water weekly.' },
      { step: 2, title: 'Light', description: 'Extremely adaptable — grows in bright indirect light to low-light corners. Variegated leaves need more light to retain their yellow patterns. Avoid harsh direct sun.' },
      { step: 3, title: 'Pruning & Training', description: 'Trim long trailing vines to encourage bushier growth. Train vines up a moss pole or wall using plant pins for a dramatic climbing display. Pinch growing tips to make it fuller.' },
      { step: 4, title: 'Propagation', description: 'One of the easiest plants to propagate! Cut 4–6 inch stem sections with at least 2–3 leaves and a node. Place in water for 2–3 weeks until roots appear, then plant in soil.' },
      { step: 5, title: 'Air Purification', description: 'NASA studies show the money plant filters formaldehyde, xylene, toluene, and benzene from indoor air. Keep one near electronics and freshly painted walls for best effect.' },
    ],
  },
  {
    name: 'Areca Palm',
    scientificName: 'Dypsis lutescens',
    slug: 'areca-palm',
    shortDescription: 'Lush tropical palm that transforms gardens and large balconies into resort-like retreats. Fast grower.',
    description: 'Fine feathery leaves with a stunning tropical appearance. Provides beautiful height and texture.',
    price: 200,
    originalPrice: 200,
    discount: 0,
    images: [{ url: '/uploads/areca-palm.jpg', alt: 'Areca Palm' }],
    thumbnail: '/uploads/areca-palm.jpg',
    category: catMap['outdoor-plants'],
    badges: ['Statement'],
    stock: 12,
    isFeatured: true,
    isBestSeller: true,
    specs: {
      height: 'Large pot', potSize: '10 inch', waterRequirement: '💧 Twice/week',
      sunlight: '☀️ Bright', difficulty: 'Intermediate', placement: 'Outdoor',
      airPurifying: true, petFriendly: true,
    },
    careInstructions: [
      { step: 1, title: 'Watering', description: 'Water 2–3 times per week in summer, ensuring the soil stays moist but not soggy. Water less in winter. Yellowing fronds often signal overwatering; brown tips signal underwatering or dry air.' },
      { step: 2, title: 'Light', description: 'Grows best in bright, indirect light outdoors. Can tolerate partial shade. Avoid harsh afternoon sun which can scorch the fronds. Indoor areca palms need a very bright spot.' },
      { step: 3, title: 'Fertilizing', description: 'Feed with a palm-specific fertilizer or slow-release granules rich in potassium and magnesium in spring and summer. Avoid over-feeding which causes salt burn on leaf tips.' },
      { step: 4, title: 'Humidity', description: 'Loves humidity. Outdoors this is rarely an issue. If kept indoors, mist fronds regularly, use a pebble tray, or place near a humidifier to prevent brown leaf tips.' },
      { step: 5, title: 'Pruning', description: 'Only remove completely brown/dead fronds by cutting at the base. Never cut green fronds — this stresses the plant and stunts growth. Let the natural shape develop freely.' },
    ],
  },
];

const seed = async () => {
  try {
    await connectDB();

    console.log('🌱 Starting database seed...\n');

    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Review.deleteMany(),
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'singhshivam112002@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Flora2024';
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log('👤 Admin user seeded');

    const createdCategories = await Category.insertMany(categories);
    const catMap = {};
    createdCategories.forEach(cat => { catMap[cat.slug] = cat._id; });
    console.log(`📂 ${createdCategories.length} categories created`);

    const productData = getProducts(catMap);
    const createdProducts = await Product.insertMany(productData);
    console.log(`🌿 ${createdProducts.length} products created`);

    console.log('\n✅ Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
