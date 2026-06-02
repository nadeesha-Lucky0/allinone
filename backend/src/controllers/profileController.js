const BusinessProfile = require('../models/BusinessProfile');
const User = require('../models/User');

// Public: fetch all APPROVED gigs for directory
exports.getApprovedProfiles = async (req, res) => {
  try {
    const approvedList = await BusinessProfile.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(approvedList);
  } catch (err) {
    res.status(500).json({ error: 'Fetch listings failed.' });
  }
};

// Client: fetch logged in user's profile
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ ownerId: req.userId });
    res.json(profile || null);
  } catch (err) {
    res.status(500).json({ error: 'Fetch my profile failed.' });
  }
};

// Admin: fetch ALL profiles for moderation queue
exports.getAdminProfiles = async (req, res) => {
  try {
    const all = await BusinessProfile.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: 'Fetch admin moderation queue failed.' });
  }
};

// Client: create business profile
exports.createProfile = async (req, res) => {
  try {
    const existing = await BusinessProfile.findOne({ ownerId: req.userId });
    if (existing) return res.status(400).json({ error: 'Business profile already registered for this account.' });

    const newProfile = new BusinessProfile({
      ownerId: req.userId,
      ...req.body,
      status: 'pending' // new listings default to pending admin review
    });

    const saved = await newProfile.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Client: update profile
exports.updateProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    // Note: server.js had an empty placeholder condition block for validation
    // Let's keep the business logic identical:
    const updated = await BusinessProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('❌ updateProfile Error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Admin: approve gig profile
exports.approveProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    profile.status = 'approved';
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin or client owner: delete gig profile
exports.deleteProfile = async (req, res) => {
  try {
    const deleted = await BusinessProfile.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Business profile not found.' });
    res.json({ message: 'Business profile successfully deleted.', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting business profile.' });
  }
};

// Client: promote business profile
exports.promoteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.allowedPromotions <= 0) {
      return res.status(400).json({ error: 'You do not have any available promotion slots. Please purchase a payment plan first.' });
    }

    const profile = await BusinessProfile.findOne({ ownerId: req.userId });
    if (!profile) return res.status(404).json({ error: 'Business profile not found.' });
    if (profile.isPromoted) return res.status(400).json({ error: 'Profile is already promoted.' });

    // Decrement promotions
    user.allowedPromotions -= 1;
    await user.save();

    profile.isPromoted = true;
    profile.promotedCategory = req.body.category || profile.category;
    await profile.save();

    res.json({ profile, allowedPromotions: user.allowedPromotions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Client: demote business profile (cancel promotion)
exports.demoteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const profile = await BusinessProfile.findOne({ ownerId: req.userId });
    if (!profile) return res.status(404).json({ error: 'Business profile not found.' });
    if (!profile.isPromoted) return res.status(400).json({ error: 'Profile is not promoted.' });

    // Refund promotion slot
    user.allowedPromotions += 1;
    await user.save();

    profile.isPromoted = false;
    profile.promotedCategory = '';
    await profile.save();

    res.json({ profile, allowedPromotions: user.allowedPromotions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
