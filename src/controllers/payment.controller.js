import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../utilities/constant'
import * as PaymentService from '../services/payment.service'
import { validationResult } from 'express-validator'

export const domesticPayment = asyncHandler(async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ message: 'Thông tin thanh toán không hợp lệ', errors: errors.array() })
    return
  }
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
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ message: 'Thông tin thanh toán không hợp lệ', errors: errors.array() })
    return
  }
  const paymentInfo = {
    apiKey: req.body.apiKey,
    cardNumber: req.body.cardNumber,
    expiredDate: req.body.expiredDate,
    CVV: req.body.CVV,
    amount: req.body.amount,
    currency: req.body.currency
  }
  try {
    const result = await PaymentService.internationalPaymentProcess(paymentInfo)
    res.status(result.status).json(result.paymentInfo || { message: result.message })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Lỗi hệ thống' })
  }
})