import User from '../models/user.model'
import asyncHandler from 'express-async-handler'
import { generateAccountNumber, generateRandomPassword } from '@src/utilities/user.utils'
import sendMail from '../utilities/mailer'
import { HttpStatusCode } from '../utilities/constant'
import env from '../config/environment'
import jwt from 'jsonwebtoken'
import Token from '../models/token.model'
import paypal from 'paypal-rest-sdk'
import { startSession } from 'mongoose'
import Service from '../models/service.model'
import * as TransactionLogService from './transactionLog.service'
import TransactionLog from '../models/transactionModel'
import { convertCurrency } from '../utilities/currency'

const SYNC_MODE = 'false'

export const findByCredentials = asyncHandler(async function (email, password) {
  let user = await User.findByCredentials(email, password)
  let token = await user.generateAuthToken()
  return {
    _id: user._id,
    name: user.name,
    birth: user.birth,
    isMale: user.isMale,
    personalIdNumber: user.personalIdNumber,
    phoneNumber: user.phoneNumber,
    email: user.email,
    homeAddress: user.homeAddress,
    job: user.job,
    accNumber: user.accNumber,
    isAdmin: user.isAdmin,
    balance: user.balance,
    token: token
  }
})

export const registerUser = asyncHandler(async function (newUser) {
  let password = generateRandomPassword()
  let numberOfUser = (await User.count({})) + 1
  let user = await User.create({
    name: newUser.name,
    birth: new Date(newUser.birth),
    isMale: newUser.isMale,
    personalIdNumber: {
      number: newUser.personalIdNumber.number,
      issueDate: newUser.personalIdNumber.issueDate,
      issuePlace: newUser.personalIdNumber.issuePlace
    },
    phoneNumber: newUser.phoneNumber,
    email: newUser.email,
    homeAddress: newUser.homeAddress,
    job: {
      title: newUser.job.title,
      workAddress: newUser.job.workAddress,
      salary: newUser.job.salary
    },
    accNumber: generateAccountNumber(numberOfUser),
    password: password,
    isAdmin: false,
    isActive: true,
    balance: 0
  })
  sendEmailRegister(user, password)
  return user
})

const sendEmailRegister = asyncHandler(async function (user, password) {
  sendMail(user.email, 'User information and password', `${JSON.stringify(user)}\npassword: ${password}`)
})

const randompassword = (length)=> {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

export const sendEmailForgot = asyncHandler(async function (email,password) {
  sendMail(email, 'Your password has changed', `New password is ${password}`)
})


export const getUserProfileById = asyncHandler(async function (userId) {
  return await User.findById(userId)
    .select('-password -__v -balanceFluctuations')
})

export const updateUserPassword = asyncHandler(async function (userId, passwordChange) {
  const user = await User.findById(userId)
  if (!user) {
    return {
      message: 'Không tìm thấy người dùng',
      status: HttpStatusCode.NOT_FOUND
    }
  }
  if (passwordChange.currentPassword && (await user.matchPassword(passwordChange.currentPassword))) {
    user.password = passwordChange.newPassword
    await user.save()
    return {
      message: 'Thay đổi mật khẩu thành công, vui lòng đăng nhập lại',
      status: HttpStatusCode.OK
    }
  }
  return {
    message: 'Mật khẩu cũ không khớp!!',
    status: HttpStatusCode.UNAUTHORIZED
  }
})

export const updateForgotPassword = asyncHandler(async function (userId) {
  const user = await User.findById(userId)
  
    let password=randompassword(7);
    user.password = password;
    const result= await user.save()
   
    return {password,result};
  
 
})

export const chargeMoneyInit = asyncHandler(async function (amount, res) {
  let create_payment_json = {
    'intent': 'sale',
    'payer': {
      'payment_method': 'paypal'
    },
    'redirect_urls': {
      'return_url': `http://${env.FRONTEND_HOSTNAME}/user/charge/submit`,
      'cancel_url': `http://${env.FRONTEND_HOSTNAME}/user/charge/submit/fail`
    },
    'transactions': [{
      'item_list': {
        'items': [{
          'name': 'Nạp tiền vào tài khoản LTS Bank',
          'sku': '001',
          'price': amount,
          'currency': 'USD',
          'quantity': 1
        }]
      },
      'amount': {
        'currency': 'USD',
        'total': amount
      },
      'description': 'Nạp tiền vào tài khoản LTS Bank'
    }]
  }
  paypal.payment.create(create_payment_json, (error, chargeInfo) => {
    if (error) {
      throw error
    } else {
      for (let i = 0; i < chargeInfo.links.length; i++) {
        if (chargeInfo.links[i].rel === 'approval_url') {
          res.json({ url: chargeInfo.links[i].href })
          return
        }
      }
    }
  })
})

export const chargeMoneyProcess = asyncHandler(async function (info, res) {
  paypal.payment.get(info.paymentId, asyncHandler((error, chargeInfo) => {
    if (error) {
      res.status(HttpStatusCode.NOT_FOUND)
      throw error
    }
    if (chargeInfo.payer.status !== 'VERIFIED') {
      res.status(HttpStatusCode.NOT_FOUND)
      throw new Error('Giao dịnh không tồn tại hoặc chưa được xác nhận')
    }
    const execute_payment_json = {
      'payer_id': chargeInfo.payer.payer_info.payer_id,
      'transactions': [{
        'amount': chargeInfo.transactions[0].amount
      }]
    }
    paypal.payment.execute(info.paymentId, execute_payment_json, async (error, chargeSuccess) => {
      if (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER)
        throw error
      }
      try {
        const service = await Service.findOne({ service_name: 'NAP TIEN PAYPAL' }).exec()
        let user = await User.findById(info.userId)
        let transactionLog = await TransactionLog.create(await TransactionLogService.createLogChargePayPal(user, chargeSuccess, service))
        transactionLog.save()
        await user.updateBalance(transactionLog, service)
        res.status(HttpStatusCode.OK).json({ message: 'Nạp tiền từ Paypal thành công' })
      } catch (error) {
        //can refund????
        console.log(error)
        throw error
      }
    })
  }))
})

export const WithdrawMoneyInit = async function (reqUser, withdrawInfo) {
  let user = await User.findOne({ _id: reqUser._id })
  let checkBalance = await checkBalanceBeforeTransaction(user, 'RUT TIEN PAYPAL', Number(withdrawInfo.amount), 'USD')
  if (!checkBalance)
    return false
  let token = jwt.sign(
    { _id: user._id, emailPayPal: withdrawInfo.emailPayPal, amount: withdrawInfo.amount, currency: 'USD' },
    env.JWT_SECRET,
    {
      expiresIn: '1d'
    })
  let tokenSave = await Token.create({
    userId: user._id,
    tokenType: 'withdraw',
    token: token
  })
  await tokenSave.save()
  const mailContext = `<p><a href="http://${env.FRONTEND_HOSTNAME}/v1/user/withdraw-money/verify?uid=${user._id}&token=${token}">Click vào đây để rút tiền</a></p>`
  sendMail(user.email, 'LTSBANK: Xác nhận rút tiền', mailContext)
  return true
}

export const withdrawMoneyProcess = asyncHandler(async function (info, res) {
  //set id user to sender_batch_id
  var sender_batch_id = Math.random().toString(36).substring(9)
  var create_payout_json = {
    'sender_batch_header': {
      'sender_batch_id': sender_batch_id,
      'email_subject': 'Rút tiền từ LTS Bank'
    },
    'items': [
      {
        'recipient_type': 'EMAIL',
        'amount': {
          'value': info.amount,
          'currency': 'USD'
        },
        'receiver': info.emailPayPal,
        'note': 'Thank you.',
        'sender_item_id': 'Rút tiền từ LTS Bank'
      }
    ]
  }
  let user = await User.findById(info._id)
  let checkBalance = await checkBalanceBeforeTransaction(user, 'RUT TIEN PAYPAL', Number(info.amount), 'USD')
  if (!checkBalance)
    return false
  await paypal.payout.create(create_payout_json, SYNC_MODE, async (error, withdrawInfo) => {
    if (error) {
      console.log(error)
      throw error
    } else {
      const service = await Service.findOne({ service_name: 'RUT TIEN PAYPAL' }).exec()
      let transactionLog = await TransactionLog.create(await TransactionLogService.createLogWithdrawPayPal(user, info, service))
      await transactionLog.save()
      await user.updateBalance(transactionLog, service)
      await Token.deleteOne({ userId: info._id, token: info.token, tokenType: 'withdraw' })
    }
  })
  return true
})

export const transferMoneyInit = asyncHandler(async function (transferInfo) {
  let remitter = await User.findById(transferInfo.remitterId)
  let receiver = await User.findOne({ accNumber: transferInfo.receiverAccNumber })
  if (!receiver)
    return { status: HttpStatusCode.BAD_REQUEST, message: 'Số tài khoản người nhận không tồn tại. Vui lòng kiểm tra lại.' }
  let checkBalance = await checkBalanceBeforeTransaction(remitter, 'CHUYEN TIEN TRONG NGAN HANG', transferInfo.amount, 'VND')
  if (!checkBalance)
    return { status: HttpStatusCode.BAD_REQUEST, message: 'Số dư không đủ để thực hiện giao dịch.' }
  let token = jwt.sign(
    { _id: remitter._id, receiverAccNumber: receiver.accNumber, amount: transferInfo.amount, currency: 'VND' },
    env.JWT_SECRET,
    {
      expiresIn: '15m'
    })
  let tokenSave = await Token.create({
    userId: remitter._id,
    tokenType: 'transfer',
    token: token
  })
  await tokenSave.save()
  const mailContext = `<p><a href="http://${env.FRONTEND_HOSTNAME}/v1/user/withdraw-money/verify?uid=${remitter._id}&token=${token}">Click vào đây để chuyển tiền</a></p>`
  sendMail(remitter.email, 'LTSBANK: Xác nhận chuyển tiền', mailContext)
  return { status: HttpStatusCode.OK, message: 'Đã gửi email xác nhận chuyển tiền, vui lòng kiểm tra email của bạn.' }
})

export const transferMoneyProcess = asyncHandler(async function (transferInfo) {
  const session = await startSession()
  await session.startTransaction()
  try {
    const opts = { session, returnOriginal: false }
    let remitter = await User.findOne({ _id: transferInfo.remitterId })
    let receiver = await User.findOne({ accNumber: transferInfo.receiverAccNumber })
    let checkBalance = await checkBalanceBeforeTransaction(remitter, 'CHUYEN TIEN TRONG NGAN HANG', transferInfo.amount, 'VND')
    if (!checkBalance) {
      await session.abortTransaction()
      session.endSession()
      return { status: HttpStatusCode.BAD_REQUEST, message: 'Số dư không đủ để thực hiện giao dịch.' }
    }
    const service = await Service.findOne({ service_name: 'CHUYEN TIEN TRONG NGAN HANG' }).exec()
    let transactionLog = await TransactionLog.create(await TransactionLogService.createLogTransfer(remitter, receiver, transferInfo, service))
    await remitter.updateBalance(transactionLog, service, opts)
    await receiver.receiveMoney(transactionLog, opts)
    console.log(transferInfo)
    await Token.deleteOne({ userId: transferInfo.remitterId, token: transferInfo.token, tokenType: 'transfer' }, opts)
    await session.commitTransaction()
    session.endSession()
  } catch (error) {
    await session.abortTransaction()
    console.log(error)
    return { status: HttpStatusCode.INTERNAL_SERVER, message: 'Đã có lỗi xảy ra trong khi giao dịch.' }
  }
  return { status: HttpStatusCode.OK, message: 'Chuyển tiền thành công.' }
})

export const checkBalanceBeforeTransaction = async function (user, serviceName, amount, fromCurrency) {
  const service = await Service.findOne({ service_name: serviceName }).exec()
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
  console.log(fee)
  if (fee.toCurrency.transactionAmount > fee.toCurrency.transactionFee + user.balance) {
    return false
  }
  return true
}