const Plan = require('../models/Plan');
const User = require('../models/User');

// Get all plans
exports.getPlans = async (req, res) => {
  try {
    const list = await Plan.find().sort({ price: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Retrieving plans failed.' });
  }
};

// Create a new plan (Admin)
exports.createPlan = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Administrative authority required.' });
    }

    const { name, price, adCount, description } = req.body;
    if (!name || price === undefined || adCount === undefined) {
      return res.status(400).json({ error: 'Name, price and adCount are required.' });
    }

    const exists = await Plan.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (exists) {
      return res.status(400).json({ error: 'Plan already exists with this name.' });
    }

    const fresh = await Plan.create({ name, price, adCount, description });
    res.status(201).json(fresh);
  } catch (err) {
    res.status(500).json({ error: 'Creating plan failed.' });
  }
};

// Update an existing plan (Admin)
exports.updatePlan = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Administrative authority required.' });
    }

    const { name, price, adCount, description } = req.body;
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    if (name) {
      // Check for duplicates excluding current plan
      const exists = await Plan.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      if (exists) {
        return res.status(400).json({ error: 'Another plan already exists with this name.' });
      }
      plan.name = name;
    }

    if (price !== undefined) plan.price = price;
    if (adCount !== undefined) plan.adCount = adCount;
    if (description !== undefined) plan.description = description;

    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Updating plan failed.' });
  }
};

// Delete a plan (Admin)
exports.deletePlan = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Administrative authority required.' });
    }

    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }
    res.json({ message: 'Plan successfully deleted.', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Deleting plan failed.' });
  }
};
