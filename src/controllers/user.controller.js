import User from '@src/models/user.model'
import env from '../config/environment'
import * as UserService from '../services/user.service'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../utilities/constant'
import { validationResult } from 'express-validator'
import paypal from 'paypal-rest-sdk'


const authUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ message: 'Email hoặc password không hợp lệ', errors: errors.array() })
    return
  }
  const { email, password } = req.body
  const user = await UserService.findByCredentials(email, password)
  if (!user) {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('Email hoặc password không hợp lệ')
  }
  res.json(user)
})

const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ message: 'Lỗi đăng kí người dùng!!!', errors: errors.array() })
    return
  }
  const newUser = req.body
  if (await User.isExist(newUser.email)) {
    res.status(HttpStatusCode.BAD_REQUEST)
    throw new Error('Người dùng đã tồn tại!!')
  }
  try {
    await UserService.registerUser(newUser)
    res.status(HttpStatusCode.CREATED)
      .json({ message: 'Tạo tài khoản thành công, vui lòng kiểm tra email của bạn!' })
  } catch {
    res.status(HttpStatusCode.INTERNAL_SERVER)
      .json({ message: 'INTERNAL SERVER ERROR' })
  }
})

const getUserProfile = asyncHandler(async (req, res) => {
  let userId = req.user._id
  const user = await UserService.getUserProfileById(userId)
  if (user) {
    res.json(user)
  }
  else {
    res.status(HttpStatusCode.NOT_FOUND)
      .json({ message: 'User not found' })
  }
})

const updateUserPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }
  const userId = req.user._id
  const passwordChange = {
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword
  }
  const result = await UserService.updateUserPassword(userId, passwordChange)
  res.status(result.status).json({ message: result.message })
})

export const logOutUser = asyncHandler(async (req, res) => {
  try {
    await req.user.logOut(req.token)
    res.json({ message: 'Đăng xuất thành công' })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw Error('Lỗi khi đăng xuất khỏi thiết bị')
  }
})

export const logOutAll = asyncHandler(async (req, res) => {
  try {
    req.user.logOutAll()
    res.json({ message: 'Đăng xuất khỏi tất cả thiết bị thành công' })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
      .json({ message: 'Lỗi khi đăng xuất khỏi tất cả thiết bị' })
  }
})

paypal.configure({
  'mode': 'sandbox',
  'client_id': env.PAYPAL_CLIENT_ID,
  'client_secret': env.PAYPAL_CLIENT_SECRET
})

export const chargeUser = asyncHandler(async (req, res) => {
  //sb-v7mkg8597409@business.example.com
  //testsandbox     NC,^5NCl

  //sb-q2eib8526496@personal.example.com
  //wx<q-W8S
  const amount = req.body.amount
  try {
    await UserService.chargeMoneyInit(amount, res)
  } catch (error) {
    req.status(HttpStatusCode.INTERNAL_SERVER)
    throw Error('Không thể khởi tạo giao dịch')
  }
})

export const chargeSubmitUser = asyncHandler(async (req, res) => {
  const info = {
    payerId: req.body.PayerID,
    paymentId: req.body.paymentId,
    userId: req.user._id
  }
  try {
    await UserService.chargeMoneyProcess(info, res)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Không thể thực hiện giao dịch')
  }
})

export const withdrawMoneyUser = asyncHandler(async (req, res) => {
  const withdrawInfo = {
    emailPayPal: req.body.emailPayPal,
    amount: req.body.amount
  }
  try {
    if (await UserService.WithdrawMoneyInit(req.user, withdrawInfo))
      res.status(HttpStatusCode.OK).json({ message: 'Đã gửi email xác nhận rút tiền đến tài khoản của bạn, vui lòng kiểm tra email' })
    else {
      res.status(HttpStatusCode.BAD_REQUEST)
      throw new Error('Số dư của bạn không đủ để rút tiền')
    }
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw Error('Không thể gửi email')
  }
})

export const getWithdrawMoneyInfoUser = asyncHandler(async function (req, res) {
  res.status(HttpStatusCode.OK).json(req.withdrawInfo)
})

export const withdrawMoneySubmitUser = asyncHandler(async (req, res) => {
  const info = {
    emailPayPal: req.withdrawInfo.emailPayPal,
    amount: req.withdrawInfo.amount,
    _id: req.withdrawInfo._id,
    token: req.body.token
  }
  if (await UserService.withdrawMoneyProcess(info, res))
    res.status(HttpStatusCode.OK).json({ message: 'Rút tiền thành công về ví PayPal' })
  else {
    res.status(HttpStatusCode.BAD_REQUEST)
    throw new Error('Số dư của bạn không đủ để rút tiền')
  }
})

export const forgotPassword = asyncHandler(async function () {

})

export const transferMoneyUser = asyncHandler(async function (req, res) {
  const info = {
    receiverAccNumber: req.body.accNumber,
    amount: Number(req.body.amount),
    remitterId: req.user._id
  }
  try {
    let result = await UserService.transferMoneyInit(info)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Không thể gửi email')
  }

})

export const getTransferMoneyInfoUser = asyncHandler(async function (req, res) {
  res.status(HttpStatusCode.OK).json(req.transferInfo)
})

export const transferMoneySubmitUser = asyncHandler(async function (req, res) {
  const info = {
    receiverAccNumber: req.transferInfo.receiverAccNumber,
    amount: Number(req.transferInfo.amount),
    remitterId: req.transferInfo._id,
    token: req.body.token
  }
  let result = await UserService.transferMoneyProcess(info)
  res.status(result.status).json({ message: result.message })
})

export { authUser, getUserProfile, registerUser, updateUserPassword }