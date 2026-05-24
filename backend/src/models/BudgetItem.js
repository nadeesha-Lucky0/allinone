const mongoose = require('mongoose');

const budgetItemSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Venue', 'Catering', 'Attire', 'Music', 'Photography', 'Decor', 'Other'],
    default: 'Other'
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  estimatedCost: {
    type: Number,
    default: 0,
    min: 0
  },
  actualCost: {
    type: Number,
    default: 0,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  },
  dueDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BudgetItem', budgetItemSchema);
