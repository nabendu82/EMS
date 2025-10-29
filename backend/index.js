import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import departmentRoutes from './routes/department.js'
import employeeRoutes from './routes/employee.js'
import connectDB from './db/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/api/auth', authRoutes)
app.use('/api/department', departmentRoutes)
app.use('/api/employee', employeeRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})