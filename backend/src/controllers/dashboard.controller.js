const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

// GET /api/dashboard/summary?year=2026
// สรุปยอดรวมรายเดือน ทั้งปี (สำหรับกราฟแท่ง/เส้น 12 เดือน)
exports.summary = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ message: 'กรุณาระบุ year' });

    const rows = await sequelize.query(`
      SELECT 
        MONTH(billing_month) AS month,
        COALESCE(SUM(amount), 0) AS total
      FROM expenses
      WHERE YEAR(billing_month) = :year
      GROUP BY MONTH(billing_month)
      ORDER BY month ASC
    `, {
      replacements: { year },
      type: QueryTypes.SELECT,
    });

    // เติมเดือนที่ไม่มีข้อมูลให้เป็น 0 ครบ 12 เดือน เพื่อให้กราฟไม่ขาดช่วง
    const result = Array.from({ length: 12 }, (_, i) => {
      const found = rows.find(r => r.month === i + 1);
      return { month: i + 1, total: found ? Number(found.total) : 0 };
    });

    const yearTotal = result.reduce((sum, r) => sum + r.total, 0);

    res.json({ year: Number(year), months: result, yearTotal });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// GET /api/dashboard/by-category?year=2026
// สรุปแยกตามประเภทค่าใช้จ่าย (สำหรับกราฟวงกลม)
exports.byCategory = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ message: 'กรุณาระบุ year' });

    const rows = await sequelize.query(`
      SELECT 
        ec.id, ec.name, ec.code,
        COALESCE(SUM(e.amount), 0) AS total
      FROM expense_categories ec
      LEFT JOIN expenses e 
        ON e.expense_category_id = ec.id AND YEAR(e.billing_month) = :year
      GROUP BY ec.id, ec.name, ec.code
      ORDER BY total DESC
    `, {
      replacements: { year },
      type: QueryTypes.SELECT,
    });

    res.json(rows.map(r => ({ ...r, total: Number(r.total) })));
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// GET /api/dashboard/by-budget?year=2026
// สรุปแยกตามหมวดเงิน (สำหรับกราฟแท่งซ้อน)
exports.byBudget = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ message: 'กรุณาระบุ year' });

    const rows = await sequelize.query(`
      SELECT 
        bc.id, bc.name, bc.code,
        MONTH(e.billing_month) AS month,
        COALESCE(SUM(e.amount), 0) AS total
      FROM budget_categories bc
      LEFT JOIN expenses e 
        ON e.budget_category_id = bc.id AND YEAR(e.billing_month) = :year
      GROUP BY bc.id, bc.name, bc.code, MONTH(e.billing_month)
      ORDER BY bc.id, month
    `, {
      replacements: { year },
      type: QueryTypes.SELECT,
    });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// GET /api/dashboard/compare?year1=2025&year2=2026
// เปรียบเทียบยอดรายเดือน ปีต่อปี
exports.compare = async (req, res) => {
  try {
    const { year1, year2 } = req.query;
    if (!year1 || !year2) {
      return res.status(400).json({ message: 'กรุณาระบุ year1 และ year2' });
    }

    const getMonthlyTotals = async (year) => {
      const rows = await sequelize.query(`
        SELECT MONTH(billing_month) AS month, COALESCE(SUM(amount), 0) AS total
        FROM expenses
        WHERE YEAR(billing_month) = :year
        GROUP BY MONTH(billing_month)
      `, { replacements: { year }, type: QueryTypes.SELECT });

      return Array.from({ length: 12 }, (_, i) => {
        const found = rows.find(r => r.month === i + 1);
        return found ? Number(found.total) : 0;
      });
    };

    const year1Totals = await getMonthlyTotals(year1);
    const year2Totals = await getMonthlyTotals(year2);

    res.json({
      year1: Number(year1),
      year2: Number(year2),
      year1Totals,
      year2Totals,
    });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};