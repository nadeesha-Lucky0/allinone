const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Public: get all landing page reviews
router.get('/', reviewController.getReviews);

// Public: create a new landing page review (validated with email/google auth details)
router.post('/', reviewController.createReview);

module.exports = router;
