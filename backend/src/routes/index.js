const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const profileRoutes = require('./profileRoutes');

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
router.use('/profiles', profileRoutes);

module.exports = router;
