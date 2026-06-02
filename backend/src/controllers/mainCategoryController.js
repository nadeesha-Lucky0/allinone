const MainCategory = require('../models/MainCategory');
const Category = require('../models/Category');

// Get all main categories
exports.getMainCategories = async (req, res) => {
  try {
    const list = await MainCategory.find().sort({ name: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Retrieving main categories failed.' });
  }
};

// Admin add main category
exports.createMainCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Main category name is required.' });

    // Validate if main category exists
    const exists = await MainCategory.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (exists) return res.status(400).json({ error: 'Main category already exists.' });

    const fresh = await MainCategory.create({ name });
    res.status(201).json(fresh);
  } catch (err) {
    res.status(500).json({ error: 'Adding main category failed.' });
  }
};

// Admin delete main category
exports.deleteMainCategory = async (req, res) => {
  try {
    const mainCat = await MainCategory.findOne({ name: req.params.name });
    if (!mainCat) return res.status(404).json({ error: 'Main category not found.' });

    // Check if there are subcategories linked to this main category
    const linkedCount = await Category.countDocuments({ mainCategory: mainCat._id });
    if (linkedCount > 0) {
      return res.status(400).json({ error: 'Cannot delete main category: it has active subcategory mappings. Delete the subcategories first.' });
    }

    await MainCategory.findByIdAndDelete(mainCat._id);
    res.json({ message: 'Main category removed successfully.', name: req.params.name });
  } catch (err) {
    res.status(500).json({ error: 'Removing main category failed.' });
  }
};
