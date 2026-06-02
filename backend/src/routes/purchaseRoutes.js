const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authenticate = require('../middleware/auth');

// Clients & Admins: get purchase transactions history
router.get('/', authenticate, purchaseController.getPurchases);

// Clients: buy/checkout a plan request
router.post('/', authenticate, purchaseController.createPurchase);

// Admins: approve checkout transaction
router.patch('/:id/approve', authenticate, purchaseController.approvePurchase);

// Admins: decline checkout transaction
router.patch('/:id/decline', authenticate, purchaseController.declinePurchase);

module.exports = router;
