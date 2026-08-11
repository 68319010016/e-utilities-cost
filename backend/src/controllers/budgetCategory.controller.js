const BudgetCategory = require('../models/budgetCategory.model');

exports.getAll = async (req, res) => {
  try {
    const categories = await BudgetCategory.findAll({ order: [['id', 'ASC']] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'กรุณากรอก name และ code' });
    }
    const category = await BudgetCategory.create({ name, code });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await BudgetCategory.findByPk(id);
    if (!category) return res.status(404).json({ message: 'ไม่พบข้อมูล' });

    const { name, code, is_active } = req.body;
    await category.update({ name, code, is_active });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await BudgetCategory.findByPk(id);
    if (!category) return res.status(404).json({ message: 'ไม่พบข้อมูล' });

    await category.destroy();
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};