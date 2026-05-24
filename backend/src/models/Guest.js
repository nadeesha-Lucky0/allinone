const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  rsvpStatus: {
    type: String,
    enum: ['pending', 'attending', 'declined'],
    default: 'pending'
  },
  guestsCount: {
    type: Number,
    default: 1,
    min: 1
  },
  dietaryRequirements: {
    type: String,
    trim: true
  },
  tableNumber: {
    type: String,
    trim: true,
    default: ''
  },
  plusOneName: {
    type: String,
    trim: true,
    default: ''
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Guest', guestSchema);
