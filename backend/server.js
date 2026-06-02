const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./src/config/db');
const apiRoutes = require('./src/routes');

const User = require('./src/models/User');
const MainCategory = require('./src/models/MainCategory');
const Category = require('./src/models/Category');
const BusinessProfile = require('./src/models/BusinessProfile');
const Review = require('./src/models/Review');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Mount All Routes
app.use('/api', apiRoutes);

// Serve static assets from frontend build in same-origin production
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Fallback all other routes to index.html for Single Page App routing
app.get('*', (req, res) => {
  // If it's an API request that didn't match a route, send a clean 404
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      status: 'error',
      message: 'API endpoint not found'
    });
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Seed Categories and Profiles
async function seedInitialData() {
  try {
    const catCount = await Category.countDocuments();
    const profileCount = await BusinessProfile.countDocuments();

    let seededAdminId;

    // Force check and update admin role in Atlas database
    let adminUser = await User.findOne({ email: 'admin@allinone.com' });
    if (adminUser) {
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('✅ Restored admin@allinone.com role to admin in MongoDB Atlas.');
      }
      seededAdminId = adminUser._id;
    } else {
      console.log('🌱 Seeding administrative user...');
      const hashedPassword = await bcrypt.hash('adminpassword', 10);
      adminUser = await User.create({
        name: 'Portal Administrator',
        email: 'admin@allinone.com',
        password: hashedPassword,
        role: 'admin'
      });
      seededAdminId = adminUser._id;
      console.log('✅ Pre-seeded: admin@allinone.com / adminpassword');
    }

    // Seed a standard client if missing
    let standardClient = await User.findOne({ role: 'client' });
    if (!standardClient) {
      const clientHashedPassword = await bcrypt.hash('clientpassword', 10);
      standardClient = await User.create({
        name: 'Nadeesha Lakshan',
        email: 'nadeesha@client.com',
        password: clientHashedPassword,
        role: 'client'
      });
      console.log('✅ Pre-seeded client account: nadeesha@client.com / clientpassword');
    }

    // Seed Main Categories if missing
    let weddingMain = await MainCategory.findOne({ name: 'Wedding' });
    let birthdayMain = await MainCategory.findOne({ name: 'Birthday Events' });
    let corporateMain = await MainCategory.findOne({ name: 'Corporate Events' });

    if (!weddingMain) {
      weddingMain = await MainCategory.create({ name: 'Wedding' });
      console.log('✅ Seeded Main Category: Wedding');
    }
    if (!birthdayMain) {
      birthdayMain = await MainCategory.create({ name: 'Birthday Events' });
      console.log('✅ Seeded Main Category: Birthday Events');
    }
    if (!corporateMain) {
      corporateMain = await MainCategory.create({ name: 'Corporate Events' });
      console.log('✅ Seeded Main Category: Corporate Events');
    }

    if (catCount === 0) {
      console.log('🌱 Seeding service categories...');
      await Category.insertMany([
        { name: 'Photography', mainCategory: weddingMain._id },
        { name: 'Saloon', mainCategory: weddingMain._id },
        { name: 'Saree Rent', mainCategory: weddingMain._id },
        { name: 'Wedding Car Rent', mainCategory: weddingMain._id },
        { name: 'Wedding Photographers', mainCategory: weddingMain._id },
        { name: 'Graduation Photographers', mainCategory: corporateMain._id }
      ]);
      console.log('✅ Seeding categories completed.');
    }

    // Seed standard subscription plans if missing
    const Plan = require('./src/models/Plan');
    const planCount = await Plan.countDocuments();
    if (planCount === 0) {
      console.log('🌱 Seeding event subscription plans...');
      await Plan.insertMany([
        { name: 'Plan A (Bronze)', price: 3500, adCount: 1, description: 'Promote 1 business directory listing at the top of its curated subcategory search results.' },
        { name: 'Plan B (Premium Gold)', price: 8000, adCount: 3, description: 'Promote up to 3 business directory listings at the top of category pages for maximum ads.' }
      ]);
      console.log('✅ Seeding subscription plans completed.');
    }

    if (profileCount === 0) {
      console.log('🌱 Seeding approved corporate profiles...');
      await BusinessProfile.insertMany([
        {
          ownerId: seededAdminId,
          businessName: 'Vivid Memory Studios',
          businessEmail: 'info@vividmemories.com',
          phone: '+94-77-123-4567',
          address: '42 Orchid Lane, Colombo 07',
          location: 'Colombo',
          category: 'Wedding Photographers',
          status: 'approved',
          imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=600&auto=format&fit=crop',
          description: 'Premier cinematic wedding storytelling and dynamic high-definition wedding photobooks. Experienced staff with high-end cameras.',
          pricing: 'Premium packages start from LKR 350,000',
          website: 'https://vividmemories.com'
        },
        {
          ownerId: seededAdminId,
          businessName: 'Aura Premium Salon & Bridal',
          businessEmail: 'aura@salonsuite.com',
          phone: '+9 Sri Lanka lines',
          address: 'Galle Road, Bambalapitiya',
          location: 'Galle',
          category: 'Saloon',
          status: 'approved',
          imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop',
          description: 'High-end bridal salon services, modern hairstyles, skin conditioning treatments, and elegant manicure packages for your perfect day.',
          pricing: 'Standard packages start from LKR 120,000',
          website: 'https://aurasalon.lk'
        },
        {
          ownerId: seededAdminId,
          businessName: 'Classic Vintage Wheels',
          businessEmail: 'rentals@classicwheels.com',
          phone: '+94-11-888-9999',
          address: 'Kandy Road, Kadawatha',
          location: 'Kandy',
          category: 'Wedding Car Rent',
          status: 'approved',
          imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop',
          description: 'A luxurious fleet of Rolls Royce, vintage Mercedes, and elegant limousines for bridal transport. Experienced professional chauffeurs included.',
          pricing: 'LKR 45,000/hr flat rate including fuel',
          website: 'https://classicwheels.lk'
        },
        {
          ownerId: seededAdminId,
          businessName: 'Luxe Drapes Saree Boutique',
          businessEmail: 'sales@luxedrapes.com',
          phone: '+94-71-333-2222',
          address: 'Dehiwala Road, Nugegoda',
          location: 'Colombo',
          category: 'Saree Rent',
          status: 'approved',
          imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
          description: 'Stunning luxury bridal silk sarees, traditional designer handloom drapes, and premium jewelry rents. Custom alterations available.',
          pricing: 'Daily rental starts at LKR 25,000',
          website: 'https://luxedrapes.lk'
        }
      ]);
      console.log('✅ Seeding business profiles completed.');
    }

    // Reassign Classic Vintage Wheels, Aura Premium Salon, Luxe Drapes to belong to the Admin
    const adminCorporateNames = [
      'Aura Premium Salon & Bridal',
      'Classic Vintage Wheels',
      'Luxe Drapes Saree Boutique'
    ];
    await BusinessProfile.updateMany(
      { businessName: { $in: adminCorporateNames } },
      { ownerId: seededAdminId }
    );

    // Make sure Vivid Memory Studios belongs to standardClient (client Nadeesha) so she has an approved profile to customize and test saving gallery/pricing
    await BusinessProfile.updateOne(
      { businessName: 'Vivid Memory Studios' },
      { ownerId: standardClient._id, status: 'approved' }
    );
    console.log('✅ Corrected ownership of corporate profiles in database (Vivid Memory Studios owned by client Nadeesha).');

    // Seed default customer reviews on landing page if collection is empty
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log('🌱 Seeding default customer reviews...');
      await Review.insertMany([
        {
          name: 'Samantha Perera',
          email: 'samantha.p@gmail.com',
          rating: 5,
          comment: 'Absolutely breathtaking! We booked our wedding photographer and salon through this portal. The experience was completely seamless and both vendors exceeded our expectations.',
          avatarUrl: ''
        },
        {
          name: 'Ranil Wickramasinghe',
          email: 'ranil.w@outlook.com',
          rating: 5,
          comment: 'Perfect coordination for our corporate seminar! Finding professional graduation photographers and high-end logistical services in Colombo was never this efficient. A masterpiece of a platform.',
          avatarUrl: ''
        },
        {
          name: 'Nipuni Fernando',
          email: 'nipuni.fer@gmail.com',
          rating: 4,
          comment: 'Excellent selection of birthday coordinators and custom bakers. We sourced a marvelous theme decorator for our kids party. Highly recommend using AllInOnePlace!',
          avatarUrl: ''
        }
      ]);
      console.log('✅ Seeding default customer reviews completed.');
    }
  } catch (error) {
    console.error('❌ Seeding database templates failed:', error);
  }
}

// Connect to Database and start server
connectDB().then(async () => {
  await seedInitialData();
  app.listen(PORT, () => {
    console.log(`🚀 AllInOnePlace Server listening on port ${PORT}`);
  });
});
