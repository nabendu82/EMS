import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { addLeave, getLeaves } from '../controllers/leaveController.js'

const router = express.Router()

router.get('/', authMiddleware, getLeaves)
router.post('/add', authMiddleware, addLeave)

export default router