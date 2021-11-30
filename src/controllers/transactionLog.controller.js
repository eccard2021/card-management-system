import TransactionLog from '../models/transactionModel'
import User from '../models/user.model'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../utilities/constant'

export const getTransactionLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 4
  const skip = (page - 1) * pageSize
  const total = req.user.balanceFluctuations
  console.log(Object.getOwnPropertyNames(total));
})
