import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { addEmployee, upload } from '../controllers/employeeController.js'
const router = express.Router()

router.post('/add', authMiddleware, upload.single('image'), addEmployee)
// router.get('/', authMiddleware, getEmployees)
// router.get('/:id', authMiddleware, getEmployeeById)
// router.put('/edit/:id', authMiddleware, editEmployee)
// router.delete('/:id', authMiddleware, deleteEmployee)

export default router