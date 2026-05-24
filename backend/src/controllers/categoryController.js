const Category = require('../models/Category');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const list = await Category.find().sort({ name: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Retrieving categories failed.' });
  }
};

// Admin add category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required.' });

    // Validate if category exists
    const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (exists) return res.status(400).json({ error: 'Category already exists.' });

    const fresh = await Category.create({ name });
    res.status(201).json(fresh);
  } catch (err) {
    res.status(500).json({ error: 'Adding category failed.' });
  }
};

// Admin delete category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ name: req.params.name });
    if (!deleted) return res.status(404).json({ error: 'Category not found.' });
    res.json({ message: 'Category removed successfully.', name: req.params.name });
  } catch (err) {
    res.status(500).json({ error: 'Removing category failed.' });
  }
};
