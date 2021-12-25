import CardList from '../models/cardList.model'
import User from '../models/user.model'
import PaymentGate from '../models/paymentGate.model'
import { HttpStatusCode } from '../utilities/constant'
import { IntCredits, IntDebits, DomDebits } from '../models/cardTypes.model'
import { startSession } from 'mongoose'
import { roundNumber, convertCurrency } from '../utilities/currency'
import Service from '../models/service.model'
import TransactionLog from '../models/transactionModel'
import * as TransactionLogService from './transactionLog.service'
import * as CardService from './card.service'

const combination = {
  IntCredits: IntCredits,
  IntDebits: IntDebits,
  DomDebits: DomDebits
}

const checkMaxPayInDay = async function (card, cardType, amount, currency) {
  const today = new Date()
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

export const domesticPaymentProcess = async function (paymentInfo) {
  const gateway = await PaymentGate.findOne({ apiKey: paymentInfo.apiKey })
  if (!gateway || gateway.isGlobal) {
    return {
      status: HttpStatusCode.UNAUTHORIZED,
      message: 'Không tìm thấy cổng thanh toán hợp lệ'
    }
  }
  const card = await CardList.findOne({ cardNumber: paymentInfo.cardNumber })
  const cardType = await combination[card.cardType].findById(card.cardTypeId)
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
  if (!(await checkMaxPayInDay(card, cardType, paymentInfo.amount, paymentInfo.currency))) {
    return {
      status: HttpStatusCode.OK,
      message: 'Thẻ đã vượt quá hạn mức thanh toán trong ngày'
    }
  }
  const pay = {
    customerId: card.accOwner,
    merchantId: gateway.gateOwner,
    card: card,
    cardType: cardType,
    amount: paymentInfo.amount,
    currency: 'VND'
  }
  return await payDebitProcess(pay)
}

const payDebitProcess = async function (pay) {
  const session = await startSession()
  await session.startTransaction()
  try {
    const opts = { session, returnOriginal: false }
    let customer = await User.findById(pay.customerId)
    let merchant = await User.findById(pay.merchantId)
    let checkBalance = await checkBalanceDebit(customer, 'THANH TOAN ONLINE', pay.amount, pay.currency, pay.cardType.exCurrency)
    if (!checkBalance) {
      await session.abortTransaction()
      return { status: HttpStatusCode.BAD_REQUEST, message: 'Số dư không đủ để thực hiện giao dịch.' }
    }
    //customer process
    let service = await Service.findOne({ service_name: 'THANH TOAN ONLINE' }).exec()
    service.fee_rate = pay.cardType.exCurrency || 0
    let paymentLogCustomer = await TransactionLog.create(await TransactionLogService.createLogPayment(customer, merchant, pay, service))
    await paymentLogCustomer.save(opts)
    await customer.payment(paymentLogCustomer, pay.card, opts)
    //merchant process
    let serviceMerchant = await Service.findOne({ service_name: 'THANH TOAN ONLINE MERCHANT' }).exec()
    let paymentLogMerchant = await TransactionLog.create(await TransactionLogService.createLogPaymentMerchant(merchant, pay, serviceMerchant))
    await paymentLogMerchant.save()
    await merchant.merchantUpdate(paymentLogCustomer, paymentLogMerchant)
    //end
    await session.commitTransaction()
    return {
      status: HttpStatusCode.OK,
      paymentInfo: {
        transactionLogId: paymentLogCustomer._id,
        customerName: customer.name,
        status: 'COMPLETED',
        createAt: paymentLogCustomer.createdAt
      }
    }
  } catch (error) {
    await session.abortTransaction()
    console.log(error.stack)
    return { status: HttpStatusCode.INTERNAL_SERVER, message: 'Đã có lỗi xảy ra trong khi giao dịch.' }
  } finally {
    session.endSession()
  }
}

const checkBalanceDebit = async function (user, serviceName, amount, fromCurrency, exCurrencyRate = 0) {
  const service = await Service.findOne({ service_name: serviceName }).exec()
  service.fee_rate = exCurrencyRate
  let fee = {
    fromCurrency: {
      transactionAmount: amount,
      currency_code: fromCurrency
    },
    toCurrency: {
      transactionAmount: await convertCurrency(fromCurrency, 'VND', amount),
      currency_code: 'VND'
    }
  }
  await service.calculateServiceFee(fee)
  if (fee.toCurrency.transactionAmount > fee.toCurrency.transactionFee + user.balance) {
    return false
  }
  return true
}

export const internationalPaymentProcess = async function (paymentInfo) {
  const gateway = await PaymentGate.findOne({ apiKey: paymentInfo.apiKey })
  if (!gateway || !gateway.isGlobal) {
    return {
      status: HttpStatusCode.UNAUTHORIZED,
      message: 'No valid payment gateway found'
    }
  }
  const card = await CardList.findOne({ cardNumber: paymentInfo.cardNumber })
  const cardType = await combination[card.cardType].findById(card.cardTypeId)
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
  const pay = {
    customerId: card.accOwner,
    merchantId: gateway.gateOwner,
    card: card,
    cardType: cardType,
    amount: paymentInfo.amount,
    currency: paymentInfo.currency
  }
  if (card.cardType === 'IntDebits') {
    if (!(await checkMaxPayInDay(card, cardType, paymentInfo.amount, paymentInfo.currency))) {
      return {
        status: HttpStatusCode.OK,
        message: 'Payment limit exceeded for the day'
      }
    }
    return payDebitProcess(pay)
  } else {
    return payCreditProcess(pay)
  }
}

const payCreditProcess = async function (pay) {
  const session = await startSession()
  await session.startTransaction()
  try {
    const opts = { session, returnOriginal: false }
    let customer = await User.findById(pay.customerId)
    let merchant = await User.findById(pay.merchantId)
    let checkLimit = await checkLimitCredit(pay.card, 'THANH TOAN ONLINE', pay.amount, pay.currency, pay.cardType)
    if (!checkLimit) {
      await session.abortTransaction()
      return { status: HttpStatusCode.BAD_REQUEST, message: 'Đã vượt hạn mức cho phép' }
    }
    //customer process
    let service = await Service.findOne({ service_name: 'THANH TOAN ONLINE' }).exec()
    service.fee_rate = pay.cardType.exCurrency || 0
    let paymentLogCustomer = await TransactionLog.create(await TransactionLogService.createLogPayment(customer, merchant, pay, service))
    await paymentLogCustomer.save(opts)
    await customer.paymentCredit(paymentLogCustomer, opts)
    await CardService.creditPaymentUpdate(paymentLogCustomer, pay.card)
    //merchant process
    let serviceMerchant = await Service.findOne({ service_name: 'THANH TOAN ONLINE MERCHANT' }).exec()
    let paymentLogMerchant = await TransactionLog.create(await TransactionLogService.createLogPaymentMerchant(merchant, pay, serviceMerchant))
    await paymentLogMerchant.save()
    await merchant.merchantUpdate(paymentLogCustomer, paymentLogMerchant)
    //end
    await session.commitTransaction()
    return {
      status: HttpStatusCode.OK,
      paymentInfo: {
        transactionLogId: paymentLogCustomer._id,
        customerName: customer.name,
        status: 'COMPLETED',
        createAt: paymentLogCustomer.createdAt
      }
    }
  } catch (error) {
    await session.abortTransaction()
    console.log(error.stack)
    return { status: HttpStatusCode.INTERNAL_SERVER, message: 'Đã có lỗi xảy ra trong khi giao dịch.' }
  } finally {
    session.endSession()
  }
}

const checkLimitCredit = async function (card, serviceName, amount, fromCurrency, cardType) {
  const service = await Service.findOne({ service_name: serviceName }).exec()
  service.fee_rate = cardType.exCurrency || 0
  let fee = {
    fromCurrency: {
      transactionAmount: amount,
      currency_code: fromCurrency
    },
    toCurrency: {
      transactionAmount: await convertCurrency(fromCurrency, 'VND', amount),
      currency_code: 'VND'
    }
  }
  await service.calculateServiceFee(fee)
  if (fee.toCurrency.transactionAmount + fee.toCurrency.transactionFee + card.currentUsed > cardType.creditLine) {
    return false
  }
  return true
}
