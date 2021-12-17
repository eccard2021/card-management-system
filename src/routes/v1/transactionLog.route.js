import express from 'express'
import { protect } from '../../middlewares/auth.middleware'
import { getTransactionLogs, getTransactionLogById } from '../../controllers/transactionLog.controller'
const router = express.Router()

router.get('/logs', protect, getTransactionLogs)
router.get('/log', protect, getTransactionLogById)

export const transactionLogRoutes = router