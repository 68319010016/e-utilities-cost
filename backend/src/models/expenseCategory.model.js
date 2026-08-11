const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ExpenseCategory = sequelize.define('ExpenseCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING(20),
    defaultValue: 'บาท',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'expense_categories',
  underscored: true,
  timestamps: false, // ตารางนี้มีแค่ created_at ไม่มี updated_at ตาม plan
});

module.exports = ExpenseCategory;