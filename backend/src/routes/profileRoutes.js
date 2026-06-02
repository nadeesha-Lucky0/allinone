const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authenticate = require('../middleware/auth');

// Public: Get all approved profiles
router.get('/', profileController.getApprovedProfiles);

// Client: Get own profile
router.get('/my', authenticate, profileController.getMyProfile);

// Admin: Get all profiles for moderation
router.get('/admin', authenticate, profileController.getAdminProfiles);

// Client: Create profile
router.post('/', authenticate, profileController.createProfile);

// Client: Update profile
router.put('/:id', authenticate, profileController.updateProfile);

// Client: Promote profile
router.patch('/promote', authenticate, profileController.promoteProfile);

// Client: Demote profile
router.patch('/demote', authenticate, profileController.demoteProfile);

// Admin: Approve profile
router.put('/:id/approve', authenticate, profileController.approveProfile);

// Admin or Owner: Delete profile
router.delete('/:id', authenticate, profileController.deleteProfile);

module.exports = router;
