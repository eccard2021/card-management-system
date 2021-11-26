import TransactionLog from '../models/transactionModel'
import asyncHandler from 'express-async-handler'

export const createTransactionLog = asyncHandler(async (user, trasactionLog) => {
  const log = TransactionLog.create(trasactionLog)
  log.save()
  return log
})