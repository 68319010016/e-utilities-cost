const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

router.get('/summary', authMiddleware, dashboardController.summary);
router.get('/by-category', authMiddleware, dashboardController.byCategory);
router.get('/by-budget', authMiddleware, dashboardController.byBudget);
router.get('/compare', authMiddleware, dashboardController.compare);

module.exports = router;