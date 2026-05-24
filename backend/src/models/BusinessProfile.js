const mongoose = require('mongoose');

const businessProfileSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  businessEmail: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  pricing: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  gallery: {
    type: [
      {
        imageUrl: { type: String, default: '' },
        heading: { type: String, default: '' },
        description: { type: String, default: '' },
        caption: { type: String, default: '' }
      }
    ],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BusinessProfile', businessProfileSchema);
