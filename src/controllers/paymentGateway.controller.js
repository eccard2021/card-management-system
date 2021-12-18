import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../utilities/constant'
import * as PaymentGatewayService from '../services/paymentGateway.service'


export const getAllPaymentGatewayByUserID = asyncHandler(async function (req, res) {
  const userId = req.user._id
  try {
    const result = await PaymentGatewayService.getAllPaymentGatewayByUserID(userId)
    res.status(result.status).json(result.listGateway)
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Lỗi hệ thống' })
  }
})