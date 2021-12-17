import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../utilities/constant'
import * as PaymentService from '../services/payment.service'

export const domesticPayment = asyncHandler(async function (req, res) {
  const paymentInfo = {
    apiKey: req.body.apiKey,
    cardNumber: req.body.cardNumber,
    expiredDate: req.body.expiredDate,
    PIN: req.body.PIN,
    amount: req.body.amount
  }
  try {
    const result = await PaymentService.domesticPaymentProcess(paymentInfo)
    res.status(result.status).json(result.paymentInfo || { message: result.message })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Lỗi hệ thống' })
  }
})

export const internationalPayment = asyncHandler(async function (req, res) {
  const paymentInfo = {
    apiKey: req.body.apiKey,
    cardNumber: req.body.cardNumber,
    expiredDate: req.body.expiredDate,
    CVV: req.body.PIN,
    amount: req.body.amount
  }
})