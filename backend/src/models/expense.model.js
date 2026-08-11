const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ExpenseCategory = require('./expenseCategory.model');
const BudgetCategory = require('./budgetCategory.model');
const User = require('./user.model');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  expense_category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  budget_category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  billing_month: {
    type: DataTypes.DATEONLY, // เก็บแค่วันที่ ไม่มีเวลา
    allowNull: false,
  },
  paid_date: DataTypes.DATEONLY,
  invoice_no: DataTypes.STRING(50),
  note: DataTypes.TEXT,
  attachment_path: DataTypes.STRING(255),
  created_by: DataTypes.INTEGER,
}, {
  tableName: 'expenses',
  underscored: true,
});

// ผูกความสัมพันธ์ เพื่อให้ query แบบ join ข้อมูลชื่อประเภท/หมวดเงินออกมาด้วยได้
Expense.belongsTo(ExpenseCategory, { foreignKey: 'expense_category_id', as: 'expenseCategory' });
Expense.belongsTo(BudgetCategory, { foreignKey: 'budget_category_id', as: 'budgetCategory' });
Expense.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = Expense;