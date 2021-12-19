import * as corn from 'node-cron'
import Service from '../models/service.model'
import User from '../models/user.model'
import TransactionLog from '../models/transactionModel'
import * as TransactionLogService from '../services/transactionLog.service'
import { startSession } from 'mongoose'
import CardList from '../models/cardList.model'
import { IntCredits } from '../models/cardTypes.model'

export const scheduler = function () {
  // 00:00:00 AM ngày 20 hàng tháng tính phí duy trì tài khoản
  corn.schedule('0 0 0 20 * *', processAccountMaintenanceFee)
  corn.schedule('0 0 0 * * *', processAccountingCredit)
  //corn.schedule('0 0 0 * * *', processInterestCredit)
}

const processAccountMaintenanceFee = async function () {
  let users = await User.find()
  const service = await Service.findOne({ service_name: 'PHI DUY TRI TAI KHOAN' })
  users.forEach(async (user) => {
    if (user.balance == 0)
      return
    const session = await startSession()
    await session.startTransaction()
    try {
      const opts = { session, returnOriginal: false }
      const log = await TransactionLog.create(await TransactionLogService.createLogAccountMaintenanceFee(user, service))
      await user.accountMaintenanceFee(log, opts)
      await log.save(opts)
      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      console.log(error)
    } finally {
      session.endSession()
    }
  })
}

const processAccountingCredit = async function () {
  const today = new Date()
  const cardTypes = await IntCredits.find({ statmentDay: today.getUTCDate() })
  cardTypes.forEach(async (cardType) => {
    let lastMonth = new Date(today.getUTCFullYear(), today.getUTCMonth() - 1, cardType.statmentDay)
    let currentMonth = new Date(today.getUTCFullYear(), today.getUTCMonth(), cardType.statmentDay)
    let cardList = await CardList.find({ cardTypeId: cardType._id, accOwner: { '$ne': null } })
    cardList.forEach(async (card) => {
      const sumCreditInMonth = await TransactionLog.aggregate([
        {
          '$match': {
            'from.number': card.cardNumber,
            'createdAt': {
              '$gt': lastMonth,
              '$lte': currentMonth
            }
          }
        },
        {
          '$group': {
            _id: null,
            amountInMonth: { $sum: '$fromCurrency.transactionAmount' }
          }
        }
      ])
      let usedInMonth = 0
      if (sumCreditInMonth.length != 0)
        usedInMonth = sumCreditInMonth[0].amountInMonth
      const session = await startSession()
      await session.startTransaction()
      try {
        const opts = { session, returnOriginal: false }
        card.debt += card.currentUsed
        card.currentUsed = usedInMonth
        card.save(opts)
      } catch (error) {
        await session.abortTransaction()
        console.log(error)
      } finally {
        session.endSession()
      }
    })
  })
}

const processInterestCredit = async function () {
  const today = new Date()
  const cardTypes = await IntCredits.find({
    statmentDay: {
      $dayOfMonth: {
        $subtract: [today, { $multiply: ['$payWithin', 86400 * 1000] }]
      }
    }
  })
}