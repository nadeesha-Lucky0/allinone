const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const authenticate = require('../middleware/auth');

// Public: get available plans
router.get('/', planController.getPlans);

// Admin: create a new subscription plan
router.post('/', authenticate, planController.createPlan);

// Admin: update an existing subscription plan
router.put('/:id', authenticate, planController.updatePlan);

// Admin: delete a subscription plan
router.delete('/:id', authenticate, planController.deletePlan);

module.exports = router;
