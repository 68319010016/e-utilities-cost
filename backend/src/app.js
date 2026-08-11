const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/auth.routes')
const categoryRoutes = require('./routes/category.routes')
const expenseRoutes = require('./routes/expense.routes')
const dashboardRoutes = require('./routes/dashboard.routes')

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api', categoryRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.get('/', (req, res) => res.json({ message: 'e-utilities-cost API ทำงานปกติ' }))

module.exports = app