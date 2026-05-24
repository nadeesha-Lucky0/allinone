const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middleware/auth');

// Public: Get all categories
router.get('/', categoryController.getCategories);

// Admin: Add a new category
router.post('/', authenticate, categoryController.createCategory);

// Admin: Remove a category by name
router.delete('/:name', authenticate, categoryController.deleteCategory);

module.exports = router;
