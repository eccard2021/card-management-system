import TransactionLog from '../models/transactionModel'
import User from '../models/user.model'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../utilities/constant'

export const getTransactionLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 0
  const pageSize = 3
  const skip = page * pageSize
  const query = { _id: req.user._id }
  /*const u = await User.findOne(query)
    .populate({
      path: 'balanceFluctuations.transactionLog',
      populate: { path: 'transType' }
    })
    .select('balanceFluctuations.$')*/
  const u = await User.aggregate([
    { $match: { _id: req.user._id } },
    { $unwind: '$balanceFluctuations' },
    {
      $project: {
        'transactionLog': '$balanceFluctuations.transactionLog',
        'amount': '$balanceFluctuations.amount',
        'endingBalance': '$balanceFluctuations.endingBalance'
      }
    },
    {
      $lookup: {
        from: 'transactionlogs',
        localField: 'transactionLog',
        foreignField: '_id',
        as: 'transactionLog'
      }
    }/*,
    {
      $lookup: {
        from: 'services',
        localField: 'transactionLog.transType',
        foreignField: '_id',
        as: 'transType'
      }
    }*/
  ])
  console.log(u)
  res.json(u)
})
