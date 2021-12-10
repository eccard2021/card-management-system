import TransactionLog from '../models/transactionModel'
import User from '../models/user.model'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../utilities/constant'
import CardList from '../models/cardList.model'

export const getTransactionLogs = asyncHandler(async (req, res) => {
  const logsInfo = {
    userId: req.query._id,
    page: req.query.page || 1,
    limit: 10
  }
  try {
    const result = await User.getTransactionLogs(logsInfo)
    res.status(result.status).json(result.transactionLogs)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})
