import express from 'express'
import { protect } from '../../middlewares/auth.middleware'
import { getTransactionLogs, getTransactionLogById } from '../../controllers/transactionLog.controller'
import * as Validation from '../../validators/transactionLog.validator'
const router = express.Router()

router.get('/logs', protect, getTransactionLogs)
router.get('/log', protect, Validation.validateLogId(), getTransactionLogById)

export const transactionLogRoutes = router