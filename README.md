e-utilities-cost

ระบบควบคุมและติดตามค่าสาธารณูปโภคของหน่วยงาน/สถานศึกษา (Utility Expense Tracking & Control System)

บันทึก ติดตาม และสรุปรายงานค่าใช้จ่ายสาธารณูปโภค (ค่าไฟ, ค่าน้ำ, ค่าเน็ต, ค่าโทรศัพท์ ฯลฯ) แยกตามหมวดเงินงบประมาณ พร้อม dashboard สรุปยอดรายเดือนและเปรียบเทียบย้อนหลัง

Tech Stack
ส่วนงาน	เทคโนโลยี
Backend	Node.js + Express.js
Frontend	Vue 3 (Composition API) + Vite + Tailwind CSS
Database	MariaDB
DB Admin	phpMyAdmin
Auth	JWT (jsonwebtoken) + bcrypt
ORM	Sequelize
Container	Docker + Docker Compose
State Management	Pinia
Docker Images

Image ถูก build และ push ขึ้น Docker Hub แล้ว:

Backend: 68319010016/e-utilities-cost-backend:latest
Frontend: 68319010016/e-utilities-cost-frontend:latest

ดึง image มาใช้โดยตรงได้ด้วย:

bash
docker pull 68319010016/e-utilities-cost-backend:latest
docker pull 68319010016/e-utilities-cost-frontend:latest
วิธีรันโปรเจกต์ (Getting Started)
1. Clone โปรเจกต์
bash
git clone <repo-url>
cd e-utilities-cost
2. ตั้งค่า Environment Variables

คัดลอก .env.example เป็น .env แล้วปรับค่าตามต้องการ:

env
# Database
DB_HOST=mariadb
DB_PORT=3306
DB_NAME=e_utilities_cost
DB_USER=app_user
DB_PASSWORD=changeme
DB_ROOT_PASSWORD=changeme_root

# Backend
PORT=3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Frontend
VITE_API_BASE_URL=http://localhost:3000/api

⚠️ อย่า commit ไฟล์ .env จริงขึ้น git — ใช้ .env.example เป็นตัวอย่างเท่านั้น

3. รันด้วย Docker Compose
bash
docker compose up -d

Service ที่จะรันขึ้นมา:

Service	URL	Port
Frontend	http://localhost:8080	8080
Backend API	http://localhost:3000/api	3000
phpMyAdmin	http://localhost:8081	8081
MariaDB	localhost:3306	3306
4. หยุดการทำงาน
bash
docker compose down
บัญชีสำหรับทดสอบ (Default Login)
Username	Password	Role
admin	password123	admin

🔒 สำคัญ: บัญชีนี้ใช้สำหรับทดสอบ/พัฒนาเท่านั้น ก่อน deploy จริงต้อง เปลี่ยนรหัสผ่านทันที และเก็บรหัสผ่านในฐานข้อมูลแบบ hash ด้วย bcrypt เท่านั้น ห้ามเก็บเป็น plain text และห้าม commit รหัสผ่านจริงขึ้น git

โครงสร้าง Database
users — บัญชีผู้ใช้งาน (admin / staff)
expense_categories — ประเภทค่าใช้จ่าย (ค่าไฟ, ค่าน้ำ, ค่าเน็ต ฯลฯ)
budget_categories — หมวดเงินงบประมาณที่ใช้เบิกจ่าย
expenses — รายการค่าใช้จ่ายจริง
API Endpoints หลัก
Auth
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
Expense Categories
GET    /api/expense-categories
POST   /api/expense-categories
PUT    /api/expense-categories/:id
DELETE /api/expense-categories/:id
Budget Categories
GET    /api/budget-categories
POST   /api/budget-categories
PUT    /api/budget-categories/:id
DELETE /api/budget-categories/:id
Expenses
GET    /api/expenses?month=&year=&expense_category_id=&budget_category_id=
POST   /api/expenses
GET    /api/expenses/:id
PUT    /api/expenses/:id
DELETE /api/expenses/:id
Dashboard / Reports
GET /api/dashboard/summary?year=
GET /api/dashboard/by-category?year=
GET /api/dashboard/by-budget?year=
GET /api/dashboard/compare?year1=&year2=

ทุก endpoint (ยกเว้น login) ต้องแนบ Authorization: Bearer <JWT>

Build & Push Image เอง (ถ้าต้องการ build ใหม่)
bash
# Login เข้า Docker Hub
docker login

# Build
docker build -t 68319010016/e-utilities-cost-backend:latest ./backend
docker build -t 68319010016/e-utilities-cost-frontend:latest ./frontend

# Push
docker push 68319010016/e-utilities-cost-backend:latest
docker push 68319010016/e-utilities-cost-frontend:latest
Security Notes
Password เก็บแบบ hash ด้วย bcrypt (salt rounds ≥ 10)
.env ห้าม commit ขึ้น git
ใช้ HTTPS เมื่อ deploy จริง (ผ่าน reverse proxy เช่น Nginx/Traefik)
จำกัด CORS origin เฉพาะ frontend ที่ใช้งานจริง
ผู้พัฒนา

นายชนน สุทธิรักษ์ 68319010016