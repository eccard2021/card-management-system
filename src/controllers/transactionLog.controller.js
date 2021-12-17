import * as TransactionLogService from '../services/transactionLog.service'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../utilities/constant'

export const getTransactionLogs = asyncHandler(async (req, res) => {
  const logsInfo = {
    userId: req.query._id,
    page: req.query.page || 1,
    limit: 10
  }
  try {
    const result = await TransactionLogService.getTransactionLogs(logsInfo)
    res.status(result.status).json(result.transactionLogs)
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})
