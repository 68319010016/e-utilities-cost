const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const expenseController = require('../controllers/expense.controller');

router.get('/', authMiddleware, expenseController.getAll);
router.get('/:id', authMiddleware, expenseController.getOne);
router.post('/', authMiddleware, expenseController.create);
router.put('/:id', authMiddleware, expenseController.update);
router.delete('/:id', authMiddleware, expenseController.remove);

module.exports = router;