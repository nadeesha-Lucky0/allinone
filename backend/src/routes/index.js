const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const mainCategoryRoutes = require('./mainCategoryRoutes');
const profileRoutes = require('./profileRoutes');
const planRoutes = require('./planRoutes');
const purchaseRoutes = require('./purchaseRoutes');
const reviewRoutes = require('./reviewRoutes');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'up',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    project: 'AllInOnePlace Directory'
  });
});

// Mounting Sub-routers
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/main-categories', mainCategoryRoutes);
router.use('/profiles', profileRoutes);
router.use('/plans', planRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;
