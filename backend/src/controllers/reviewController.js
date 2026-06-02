const Review = require('../models/Review');

// Get all reviews sorted by newest first
exports.getReviews = async (req, res) => {
  try {
    const list = await Review.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Retrieving customer reviews failed.' });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { name, email, rating, comment, avatarUrl } = req.body;
    
    if (!name || !email || !rating || !comment) {
      return res.status(400).json({ error: 'Name, email, rating, and comment are required.' });
    }

    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5 stars.' });
    }

    const review = await Review.create({
      name,
      email,
      rating: numericRating,
      comment,
      avatarUrl: avatarUrl || ''
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Submitting customer review failed.' });
  }
};
