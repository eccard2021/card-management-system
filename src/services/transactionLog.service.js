import { convertCurrency, getRate } from '../utilities/currency'
import mongoose from 'mongoose'
import asyncHandler from 'express-async-handler'
import TransactionLog from '../models/transactionModel'
import { HttpStatusCode } from '../utilities/constant'

export const createLogChargePayPal = async (userInfo, successInfo, service) => {
  let transactionLog = {
    from: {
      bank: 'PayPal',
      number: successInfo.payer.payer_info.email,
      remitterName: `${successInfo.payer.payer_info.first_name} ${successInfo.payer.payer_info.last_name}`
    },
    to: {
      bank: 'LTSBANK',
      number: userInfo.accNumber,
      receiverName: userInfo.name,
      UID: new mongoose.Types.ObjectId(userInfo._id)
    },
    fromCurrency: {
      transactionAmount: Number(successInfo.transactions[0].amount.total),
      currency_code: successInfo.transactions[0].amount.currency
    },
    toCurrency: {
      transactionAmount: 0,
      currency_code: 'VND'
    },
    exchangeRate: await getRate(successInfo.transactions[0].amount.currency, 'VND'),
    description: successInfo.transactions[0].description
  }
  transactionLog.transType = service._id
  transactionLog.toCurrency.transactionAmount = await convertCurrency(
    transactionLog.fromCurrency.currency_code,
    transactionLog.toCurrency.currency_code,
    transactionLog.fromCurrency.transactionAmount
  )
  await service.calculateServiceFee(transactionLog)
  return transactionLog
}

export const createLogWithdrawPayPal = async function (userInfo, successInfo, service) {
  let transactionLog = {
    from: {
      bank: 'LTSBANK',
      number: userInfo.accNumber,
      remitterName: userInfo.name,
      UID: new mongoose.Types.ObjectId(userInfo._id)
    },
    to: {
      bank: 'PayPal',
      number: successInfo.emailPayPal,
      receiverName: successInfo.emailPayPal
    },
    fromCurrency: {
      transactionAmount: 0,
      currency_code: 'VND'
    },
    toCurrency: {
      transactionAmount: Number(successInfo.amount),
      currency_code: 'USD'
    },
    exchangeRate: await getRate('VND', 'USD'),
    description: 'Rút tiền ra ví PayPal'
  }
  transactionLog.transType = service._id
  transactionLog.fromCurrency.transactionAmount = await convertCurrency(
    transactionLog.toCurrency.currency_code,
    transactionLog.fromCurrency.currency_code,
    transactionLog.toCurrency.transactionAmount
  )
  await service.calculateServiceFee(transactionLog)
  return transactionLog
}

export const createLogTransfer = async function (remitter, receiver, transferInfo, service) {
  let transactionLog = {
    from: {
      bank: 'LTSBANK',
      number: remitter.accNumber,
      remitterName: remitter.name,
      UID: new mongoose.Types.ObjectId(remitter._id)
    },
    to: {
      bank: 'LTSBANK',
      number: receiver.accNumber,
      receiverName: receiver.name,
      UID: new mongoose.Types.ObjectId(receiver._id)
    },
    fromCurrency: {
      transactionAmount: Number(transferInfo.amount),
      currency_code: 'VND'
    },
    toCurrency: {
      transactionAmount: Number(transferInfo.amount),
      currency_code: 'VND'
    },
    exchangeRate: await getRate('VND', 'VND'),
    description: 'Chuyển khoản trong LTS Bank'
  }
  transactionLog.transType = service._id
  await service.calculateServiceFee(transactionLog)
  return transactionLog
}

export const createLogPayment = async function (remitter, receiver, paymentInfo, service) {
  let transactionLog = {
    from: {
      bank: 'LTSBANK',
      number: paymentInfo.card.cardNumber,
      remitterName: remitter.name,
      UID: new mongoose.Types.ObjectId(remitter._id)
    },
    to: {
      bank: 'LTSBANK',
      number: receiver.accNumber,
      receiverName: receiver.name,
      UID: new mongoose.Types.ObjectId(receiver._id)
    },
    fromCurrency: {
      transactionAmount: 0,
      currency_code: 'VND'
    },
    toCurrency: {
      transactionAmount: Number(paymentInfo.amount),
      currency_code: paymentInfo.currency
    },
    exchangeRate: await getRate(paymentInfo.currency, 'VND'),
    description: 'Thanh toán online'
  }
  transactionLog.transType = service._id
  transactionLog.fromCurrency.transactionAmount = await convertCurrency(
    transactionLog.toCurrency.currency_code,
    transactionLog.fromCurrency.currency_code,
    transactionLog.toCurrency.transactionAmount
  )
  await service.calculateServiceFee(transactionLog)
  return transactionLog
}

export const createLogPaymentMerchant = async function (remitter, paymentInfo, service) {
  let fee = await convertCurrency(paymentInfo.currency, 'VND', Number(paymentInfo.amount)) * service.fee_rate
  let transactionLog = {
    from: {
      bank: 'LTSBANK',
      number: remitter.accNumber,
      remitterName: remitter.name,
      UID: new mongoose.Types.ObjectId(remitter._id)
    },
    to: {
      bank: 'LTSBANK',
      number: '000000',
      receiverName: 'LTSBANK'
    },
    fromCurrency: {
      transactionAmount: fee,
      transactionFee: 0,
      currency_code: 'VND'
    },
    toCurrency: {
      transactionAmount: fee,
      transactionFee: 0,
      currency_code: 'VND'
    },
    exchangeRate: await getRate(paymentInfo.currency, 'VND'),
    description: 'Phí thanh toán online của người bán'
  }
  transactionLog.transType = service._id
  return transactionLog
}

export const createLogAccountMaintenanceFee = async function (user, service) {
  let transactionLog = {
    from: {
      bank: 'LTSBANK',
      number: user.accNumber,
      remitterName: user.name,
      UID: new mongoose.Types.ObjectId(user._id)
    },
    to: {
      bank: 'LTSBANK',
      number: '000000',
      receiverName: 'LTSBANK'
    },
    fromCurrency: {
      transactionAmount: service.fixedfee,
      transactionFee: 0,
      currency_code: 'VND'
    },
    toCurrency: {
      transactionAmount: service.fixedfee,
      transactionFee: 0,
      currency_code: 'VND'
    },
    exchangeRate: 1,
    description: 'Phí duy trì tài khoản'
  }
  transactionLog.transType = service._id
  return transactionLog
}

export const getTransactionLogs = asyncHandler(async (logsInfo) => {
  const options = {
    page: logsInfo.page,
    limit: logsInfo.limit
  }
  const aggregate = TransactionLog.aggregate([
    {
      '$match': { '$or': [{ 'from.UID': logsInfo.userId }, { 'to.UID': logsInfo.userId }] }
    },
    {
      '$project': {
        'transType': 0, '__v': 0
      }
    },
    {
      '$sort': { createdAt: -1 }
    }
  ])
  const logs = await TransactionLog.aggregatePaginate(aggregate, options)
  return {
    status: HttpStatusCode.OK,
    transactionLogs: logs
  }
})

export const createLogDebtPayment = async function (user, debtInfo, service) {
  let transactionLog = {
    from: {
      bank: 'LTSBANK',
      number: user.accNumber,
      remitterName: user.name,
      UID: new mongoose.Types.ObjectId(user._id)
    },
    to: {
      bank: 'LTSBANK',
      number: '000000',
      receiverName: 'LTSBANK'
    },
    fromCurrency: {
      transactionAmount: Number(debtInfo.amount),
      transactionFee: 0,
      currency_code: 'VND'
    },
    toCurrency: {
      transactionAmount: Number(debtInfo.amount),
      transactionFee: 0,
      currency_code: 'VND'
    },
    exchangeRate: 1,
    description: 'Thanh toán nợ tín dụng'
  }
  transactionLog.transType = service._id
  return transactionLog
}

export const getTransactionLogById = async function (logInfo) {
  const log = await TransactionLog.aggregate([
    {
      '$match': {
        '_id': mongoose.Types.ObjectId(logInfo.logId),
        '$or': [{ 'from.UID': logInfo.userId }, { 'to.UID': logInfo.userId }]
      }
    },
    {
      '$lookup': {
        from: 'services',
        localField: 'transType',
        foreignField: '_id',
        as: 'transType'
      }
    },
    {
      '$unwind': '$transType'
    },
    {
      '$project': {
        'transType': { '_id': 0, '__v': 0, 'coefficient': 0 },
        '__v': 0
      }
    }
  ])
  return {
    status: HttpStatusCode.OK,
    transactionLog: log[0]
  }
}