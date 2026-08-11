const ExpenseCategory = require('../models/expenseCategory.model');

// GET /api/expense-categories
exports.getAll = async (req, res) => {
  try {
    const categories = await ExpenseCategory.findAll({ order: [['id', 'ASC']] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// POST /api/expense-categories
exports.create = async (req, res) => {
  try {
    const { name, code, unit } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'กรุณากรอก name และ code' });
    }
    const category = await ExpenseCategory.create({ name, code, unit });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// PUT /api/expense-categories/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ExpenseCategory.findByPk(id);
    if (!category) return res.status(404).json({ message: 'ไม่พบข้อมูล' });

    const { name, code, unit, is_active } = req.body;
    await category.update({ name, code, unit, is_active });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// DELETE /api/expense-categories/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ExpenseCategory.findByPk(id);
    if (!category) return res.status(404).json({ message: 'ไม่พบข้อมูล' });

    await category.destroy();
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};