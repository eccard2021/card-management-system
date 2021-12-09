import express from 'express'
import { protect } from '../../middlewares/auth.middleware'
import { getTransactionLogs } from '../../controllers/transactionLog.controller'
const router = express.Router()

router.get('/logs', protect, getTransactionLogs)

export const transactionLogRoutes = router