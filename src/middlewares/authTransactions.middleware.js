import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import Token from '../models/token.model'
import { HttpStatusCode } from '@src/utilities/constant'

export const authChargeMoney = asyncHandler(async function (req, res, next) {
  let result = await authTransactions(req, 'charge')
  if (result.status === HttpStatusCode.OK)
    next()
  else {
    res.status(result.status)
    throw new Error(result.message)
  }
})

export const authWithdrawMoney = asyncHandler(async (req, res, next) => {
  let result = await authTransactions(req, 'withdraw')
  if (result.status === HttpStatusCode.OK)
    next()
  else {
    res.status(result.status)
    throw new Error(result.message)
  }
})

export const authTransferMoney = asyncHandler(async (req, res, next) => {
  let result = await authTransactions(req, 'transfer')
  if (result.status === HttpStatusCode.OK)
    next()
  else {
    res.status(result.status)
    throw new Error(result.message)
  }
})

export const authDebtPayment = asyncHandler(async (req, res, next) => {
  let result = await authTransactions(req, 'debt-payment')
  if (result.status === HttpStatusCode.OK)
    next()
  else {
    res.status(result.status)
    throw new Error(result.message)
  }
})

const authTransactions = asyncHandler(async function (req, transType) {
  if (req.body.token) {
    try {
      req[transType + 'Info'] = jwt.verify(req.body.token, process.env.JWT_SECRET)
      if (req[transType + 'Info']._id !== req.user._id.toString()) {
        return { status: HttpStatusCode.UNAUTHORIZED, message: 'Vui lòng đăng nhập đúng tài khoản để thực hiện giao dịch.' }
      }
      const auth = await Token.findOne({ userId: req[transType + 'Info']._id, token: req.body.token, tokenType: transType })
      if (!auth) {
        return { status: HttpStatusCode.UNAUTHORIZED, message: 'Giao dịch đã hết hạn hoặc không tìm thấy' }
      }
      return { status: HttpStatusCode.OK, message: 'OK' }
    } catch (error) {
      console.log(error)
      return { status: HttpStatusCode.UNAUTHORIZED, message: 'Giao dịch đã hết hạn hoặc không tìm thấy' }
    }
  } else {
    return { status: HttpStatusCode.UNAUTHORIZED, message: 'Giao dịch đã hết hạn hoặc không tìm thấy' }
  }
})