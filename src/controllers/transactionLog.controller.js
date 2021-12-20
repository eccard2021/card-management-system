import * as TransactionLogService from '../services/transactionLog.service'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../utilities/constant'
import { validationResult } from 'express-validator'

export const getTransactionLogs = asyncHandler(async (req, res) => {
  const logsInfo = {
    userId: req.user._id,
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

export const getTransactionLogById = asyncHandler(async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ message: '_id không hợp lệ' })
    return
  }
  const logInfo = {
    logId: req.query._id,
    userId: req.user._id
  }
  try {
    const result = await TransactionLogService.getTransactionLogById(logInfo)
    res.status(result.status).json(result.transactionLog)
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})
