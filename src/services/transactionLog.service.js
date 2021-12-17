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
      transactionAmount: 0,
      currency_code: transferInfo.currency
    },
    toCurrency: {
      transactionAmount: Number(transferInfo.amount),
      currency_code: 'VND'
    },
    exchangeRate: await getRate('VND', 'VND'),
    description: 'Chuyển khoản trong LTS Bank'
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

export const createLogPayment = async function (remitter, receiver, paymentInfo, service) {
  let transactionLog = {
    from: {
      bank: 'LTSBANK',
      number: paymentInfo.cardNumber,
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
      transactionAmount: Number(paymentInfo.amount),
      currency_code: paymentInfo.currency
    },
    toCurrency: {
      transactionAmount: 0,
      currency_code: 'VND'
    },
    exchangeRate: await getRate(paymentInfo.currency, 'VND'),
    description: 'Thanh toán Online'
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

export const getTransactionLogs = asyncHandler(async (logsInfo) => {
  const logs = await TransactionLog.find({ '$or': [{ 'from.UID': logsInfo.userId }, { 'to.UID': logsInfo.userId }] })
    .select('-__v -_id')
    .skip((logsInfo.page - 1) * logsInfo.limit).limit(logsInfo.limit)
    .sort({ createdAt: -1 })
  return {
    status: HttpStatusCode.OK,
    transactionLogs: logs
  }
})