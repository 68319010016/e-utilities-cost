const { Op } = require('sequelize');
const Expense = require('../models/expense.model');
const ExpenseCategory = require('../models/expenseCategory.model');
const BudgetCategory = require('../models/budgetCategory.model');

// GET /api/expenses?month=&year=&expense_category_id=&budget_category_id=
exports.getAll = async (req, res) => {
  try {
    const { month, year, expense_category_id, budget_category_id } = req.query;
    const where = {};

    if (expense_category_id) where.expense_category_id = expense_category_id;
    if (budget_category_id) where.budget_category_id = budget_category_id;

    // กรองตามเดือน/ปีของ billing_month
    if (year && month) {
      const start = `${year}-${String(month).padStart(2, '0')}-01`;
      const end = `${year}-${String(month).padStart(2, '0')}-31`;
      where.billing_month = { [Op.between]: [start, end] };
    } else if (year) {
      where.billing_month = { [Op.between]: [`${year}-01-01`, `${year}-12-31`] };
    }

    const expenses = await Expense.findAll({
      where,
      include: [
        { model: ExpenseCategory, as: 'expenseCategory', attributes: ['id', 'name', 'code'] },
        { model: BudgetCategory, as: 'budgetCategory', attributes: ['id', 'name', 'code'] },
      ],
      order: [['billing_month', 'DESC']],
    });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// GET /api/expenses/:id
exports.getOne = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [
        { model: ExpenseCategory, as: 'expenseCategory' },
        { model: BudgetCategory, as: 'budgetCategory' },
      ],
    });
    if (!expense) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// POST /api/expenses
exports.create = async (req, res) => {
  try {
    const {
      expense_category_id, budget_category_id, amount,
      billing_month, paid_date, invoice_no, note, attachment_path,
    } = req.body;

    if (!expense_category_id || !budget_category_id || !amount || !billing_month) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ (ประเภทค่าใช้จ่าย, หมวดเงิน, จำนวนเงิน, เดือนบิล)' });
    }

    const expense = await Expense.create({
      expense_category_id,
      budget_category_id,
      amount,
      billing_month,
      paid_date,
      invoice_no,
      note,
      attachment_path,
      created_by: req.user.id, // ได้จาก JWT ผ่าน middleware
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// PUT /api/expenses/:id
exports.update = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ message: 'ไม่พบข้อมูล' });

    const {
      expense_category_id, budget_category_id, amount,
      billing_month, paid_date, invoice_no, note, attachment_path,
    } = req.body;

    await expense.update({
      expense_category_id, budget_category_id, amount,
      billing_month, paid_date, invoice_no, note, attachment_path,
    });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// DELETE /api/expenses/:id
exports.remove = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ message: 'ไม่พบข้อมูล' });

    await expense.destroy();
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};