import CardList from '../models/cardList.model'
import User from '../models/user.model'
import PaymentGate from '../models/paymentGate.model'
import { checkBalanceBeforeTransaction } from './user.service'
import { HttpStatusCode } from '../utilities/constant'
import { IntCredits, IntDebits, DomDebits } from '../models/cardTypes.model'
import { startSession } from 'mongoose'
import { roundNumber } from '../utilities/currency'
import Service from '../models/service.model'
import TransactionLog from '../models/transactionModel'
import * as TransactionLogService from './transactionLog.service'

const combination = {
  IntCredits: IntCredits,
  IntDebits: IntDebits,
  DomDebits: DomDebits
}

const checkMaxPayInDay = async function (card, amount, currency) {
  const today = new Date()
  const cardType = await combination[card.cardType].findById(card.cardTypeId)
  const amountParsed = Number(amount)
  let exCurrencyFee = 0
  let aggregate = await TransactionLog.aggregate([
    { '$match': { 'from.number': card.cardNumber } },
    {
      '$group': {
        _id: {
          day: { $dayOfMonth: '$createdAt' },
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        amountInDay: { $sum: '$toCurrency.transactionAmount' }
      }
    },
    { '$match': { '_id.day': today.getUTCDate(), '_id.month': today.getUTCMonth() + 1, '_id.year': today.getUTCFullYear() } }
  ])
  if (aggregate.length === 0 || !aggregate[0].amountInDay)
    return true
  if (card.exCurrency && currency != 'VND')
    exCurrencyFee = roundNumber(amountParsed * card.exCurrency, 2)
  if (aggregate[0].amountInDay + amountParsed + exCurrencyFee > cardType.maxPay)
    return false
  return true
}

const checkCreditLimitInMonth = async function (card, amount, currency) {
  const today = new Date()
  const cardType = await combination[card.cardType].findById(card.cardTypeId)
  const amountParsed = Number(amount)
  let exCurrencyFee = 0
  if (currency != 'VND')
    exCurrencyFee = roundNumber(amountParsed * card.exCurrency, 2)
  let aggregate = await TransactionLog.aggregate([
    { '$match': { 'from.number': card.cardNumber } },
    {
      '$group': {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        amountInMonth: { $sum: '$toCurrency.transactionAmount' }
      }
    },
    { '$match': { '_id.month': today.getUTCMonth() + 1, '_id.year': today.getUTCFullYear() } }
  ])
  if (aggregate.length === 0 || !aggregate[0].amountInMonth)
    return true
  if (aggregate[0].amountInMonth + amountParsed + exCurrencyFee > cardType.creditLine)
    return false
  return true
}

export const domesticPaymentProcess = async function (paymentInfo) {
  const gateway = await PaymentGate.findOne({ apiKey: paymentInfo.apiKey })
  if (!gateway || gateway.isGlobal) {
    return {
      status: HttpStatusCode.UNAUTHORIZED,
      message: 'Không tìm thấy cổng thanh toán hợp lệ'
    }
  }
  const card = await CardList.findOne({ cardNumber: paymentInfo.cardNumber })
  if (!card || card.cardType !== 'DomDebits')
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Không tìm thấy thông tin thẻ'
    }
  if (!(await card.matchPIN(paymentInfo.PIN)) || !(await card.matchExpiredDate(paymentInfo.expiredDate))) {
    return {
      status: HttpStatusCode.UNAUTHORIZED,
      message: 'Sai thông tin thẻ'
    }
  }
  if (!card.isActive) {
    return {
      status: HttpStatusCode.OK,
      message: 'Thẻ đã bị khoá'
    }
  }
  if (!(await checkMaxPayInDay(card, paymentInfo.amount, paymentInfo.currency))) {
    return {
      status: HttpStatusCode.OK,
      message: 'Thẻ đã vượt quá hạn mức thanh toán trong ngày'
    }
  }
  const pay = {
    customerId: card.accOwner,
    merchantId: gateway.gateOwner,
    cardNumber: card.cardNumber,
    amount: paymentInfo.amount,
    currency: 'VND'
  }
  return await payProcess(pay)
}

const payProcess = async function (pay) {
  const session = await startSession()
  await session.startTransaction()
  try {
    const opts = { session, returnOriginal: false }
    let customer = await User.findById(pay.customerId)
    let merchant = await User.findById(pay.merchantId)
    let checkBalance = await checkBalanceBeforeTransaction(customer, 'THANH TOAN ONLINE', pay.amount, pay.currency)
    if (!checkBalance) {
      await session.abortTransaction()
      return { status: HttpStatusCode.BAD_REQUEST, message: 'Số dư không đủ để thực hiện giao dịch.' }
    }
    const service = await Service.findOne({ service_name: 'THANH TOAN ONLINE' }).exec()
    let transactionLog = await TransactionLog.create(await TransactionLogService.createLogPayment(customer, merchant, pay, service))
    await customer.updateBalance(transactionLog, service, opts)
    await merchant.receiveMoney(transactionLog, opts)
    await transactionLog.save(opts)
    await session.commitTransaction()
    return {
      status: HttpStatusCode.OK,
      paymentInfo: {
        transactionLogId: transactionLog._id,
        customerName: customer.name,
        status: 'COMPLETED',
        createAt: transactionLog.createdAt
      }
    }
  } catch (error) {
    await session.abortTransaction()
    console.log(error)
    return { status: HttpStatusCode.INTERNAL_SERVER, message: 'Đã có lỗi xảy ra trong khi giao dịch.' }
  } finally {
    session.endSession()
  }
}

export const internationalPaymentProcess = async function (paymentInfo) {
  const gateway = await PaymentGate.findOne({ apiKey: paymentInfo.apiKey })
  if (!gateway) {
    return {
      status: HttpStatusCode.UNAUTHORIZED,
      message: 'No valid payment gateway found'
    }
  }
  const card = await CardList.findOne({ cardNumber: paymentInfo.cardNumber })
  if (!card || card.cardType === 'DomDebits')
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Card information not found'
    }
  if (!(await card.matchCVV(paymentInfo.CVV)) || !(await card.matchExpiredDate(paymentInfo.expiredDate))) {
    return {
      status: HttpStatusCode.UNAUTHORIZED,
      message: 'Wrong card information'
    }
  }
  if (!card.isActive) {
    return {
      status: HttpStatusCode.OK,
      message: 'Card is locked. Can not payment!'
    }
  }
  if (card.cardType === 'IntDebits') {
    if (!(await checkMaxPayInDay(card, paymentInfo.amount))) {
      return {
        status: HttpStatusCode.OK,
        message: 'Payment limit exceeded for the day'
      }
    }
  } else {
    if (!(await checkCreditLimitInMonth(card, paymentInfo.amount)))
      return {
        status: HttpStatusCode.OK,
        message: 'Credit limit exceeded'
      }
  }
}