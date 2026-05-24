const mongoose = require('mongoose');

const financeItemSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Consulting', 'SaaS', 'Marketing', 'Development', 'Hosting', 'Legal', 'Other'],
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

module.exports = mongoose.model('FinanceItem', financeItemSchema);
