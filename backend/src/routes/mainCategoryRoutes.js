const express = require('express');
const router = express.Router();
const mainCategoryController = require('../controllers/mainCategoryController');
const authenticate = require('../middleware/auth');

// Public: Get all main categories
router.get('/', mainCategoryController.getMainCategories);

// Admin: Add a new main category
router.post('/', authenticate, mainCategoryController.createMainCategory);

// Admin: Remove a main category by name
router.delete('/:name', authenticate, mainCategoryController.deleteMainCategory);

module.exports = router;
