import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { addLeave, getLeaves, getAllLeaves, getLeaveById } from '../controllers/leaveController.js'

const router = express.Router()

router.get('/all', authMiddleware, getAllLeaves)
router.get('/', authMiddleware, getLeaves)
router.get('/:id', authMiddleware, getLeaveById)
router.post('/add', authMiddleware, addLeave)

export default router