const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  tier: {
    type: String,
    enum: ['Standard', 'Premium', 'VIP'],
    default: 'Standard'
  },
  status: {
    type: String,
    enum: ['lead', 'active', 'inactive'],
    default: 'lead'
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  projectNotes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);
