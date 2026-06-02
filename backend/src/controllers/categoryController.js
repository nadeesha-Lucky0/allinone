const Category = require('../models/Category');
const MainCategory = require('../models/MainCategory');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const list = await Category.find().populate('mainCategory').sort({ name: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Retrieving categories failed.' });
  }
};

// Admin add category
exports.createCategory = async (req, res) => {
  try {
    const { name, mainCategory } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required.' });
    if (!mainCategory) return res.status(400).json({ error: 'Main category ID is required.' });

    // Validate if category exists
    const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (exists) {
      // Re-assign main category to the new one
      exists.mainCategory = mainCategory;
      await exists.save();
      const populated = await Category.findById(exists._id).populate('mainCategory');
      return res.status(200).json(populated);
    }

    const fresh = await Category.create({ name, mainCategory });
    const populated = await Category.findById(fresh._id).populate('mainCategory');
    res.status(201).json(populated);
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
