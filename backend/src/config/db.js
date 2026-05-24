const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/allinone';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB (AllInOnePlace Directory).');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
