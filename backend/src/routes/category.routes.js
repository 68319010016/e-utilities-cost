const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const expenseCategoryController = require('../controllers/expenseCategory.controller');
const budgetCategoryController = require('../controllers/budgetCategory.controller');

// Expense Categories
router.get('/expense-categories', authMiddleware, expenseCategoryController.getAll);
router.post('/expense-categories', authMiddleware, expenseCategoryController.create);
router.put('/expense-categories/:id', authMiddleware, expenseCategoryController.update);
router.delete('/expense-categories/:id', authMiddleware, expenseCategoryController.remove);

// Budget Categories
router.get('/budget-categories', authMiddleware, budgetCategoryController.getAll);
router.post('/budget-categories', authMiddleware, budgetCategoryController.create);
router.put('/budget-categories/:id', authMiddleware, budgetCategoryController.update);
router.delete('/budget-categories/:id', authMiddleware, budgetCategoryController.remove);

module.exports = router;