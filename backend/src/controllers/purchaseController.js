const Purchase = require('../models/Purchase');
const Plan = require('../models/Plan');
const User = require('../models/User');

// Get purchase transactions
exports.getPurchases = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    let list;
    if (user.role === 'admin') {
      list = await Purchase.find()
        .populate('userId', 'name email allowedPromotions')
        .populate('planId')
        .sort({ createdAt: -1 });
    } else {
      list = await Purchase.find({ userId: req.userId })
        .populate('planId')
        .sort({ createdAt: -1 });
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Retrieving purchases failed.' });
  }
};

// Purchase a plan (Client checkout request)
exports.createPurchase = async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) return res.status(400).json({ error: 'Plan ID is required.' });

    const targetPlan = await Plan.findById(planId);
    if (!targetPlan) return res.status(404).json({ error: 'Plan not found.' });

    const fresh = await Purchase.create({
      userId: req.userId,
      planId,
      adCount: targetPlan.adCount,
      status: 'pending'
    });

    const populated = await Purchase.findById(fresh._id).populate('planId');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Creating purchase request failed.' });
  }
};

// Approve a purchase (Admin)
exports.approvePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ error: 'Purchase record not found.' });
    if (purchase.status !== 'pending') return res.status(400).json({ error: 'Transaction is already processed.' });

    purchase.status = 'approved';
    await purchase.save();

    // Increment allowedPromotions for the User
    await User.findByIdAndUpdate(purchase.userId, {
      $inc: { allowedPromotions: purchase.adCount }
    });

    const populated = await Purchase.findById(purchase._id)
      .populate('userId', 'name email allowedPromotions')
      .populate('planId');

    res.json({ message: 'Purchase transaction approved successfully.', purchase: populated });
  } catch (err) {
    res.status(500).json({ error: 'Approving purchase failed.' });
  }
};

// Decline a purchase (Admin)
exports.declinePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ error: 'Purchase record not found.' });
    if (purchase.status !== 'pending') return res.status(400).json({ error: 'Transaction is already processed.' });

    purchase.status = 'declined';
    await purchase.save();

    const populated = await Purchase.findById(purchase._id)
      .populate('userId', 'name email allowedPromotions')
      .populate('planId');

    res.json({ message: 'Purchase transaction declined.', purchase: populated });
  } catch (err) {
    res.status(500).json({ error: 'Declining purchase failed.' });
  }
};
