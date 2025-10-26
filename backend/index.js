import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import departmentRoutes from './routes/department.js'
import connectDB from './db/db.js'

connectDB()
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/department', departmentRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})