require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ');
    app.listen(PORT, () => {
      console.log(`🚀 Server กำลังทำงานที่ port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ เชื่อมต่อฐานข้อมูลไม่สำเร็จ:', err.message);
  });