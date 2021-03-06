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
import * as CardService from '../services/card.service'


const SYNC_MODE = 'false'
paypal.configure({
  'mode': 'sandbox',
  'client_id': env.PAYPAL_CLIENT_ID,
  'client_secret': env.PAYPAL_CLIENT_SECRET
})


export const findByCredentials = asyncHandler(async function (email, password) {
  let user = await User.findByCredentials(email, password)
  if (!user)
    return user
  let token = await user.generateAuthToken()
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: token
  }
})

export const registerUser = asyncHandler(async function (newUser) {
  let password = generateRandomPassword(12)
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

export const getUserProfileById = asyncHandler(async function (userId) {
  return await User.findById(userId)
    .select('-password -__v -balanceFluctuations')
})

export const updateUserPassword = asyncHandler(async function (userId, passwordChange) {
  const user = await User.findById(userId)
  if (!user) {
    return {
      message: 'Kh??ng t??m th???y ng?????i d??ng',
      status: HttpStatusCode.NOT_FOUND
    }
  }
  if (passwordChange.currentPassword && (await user.matchPassword(passwordChange.currentPassword))) {
    user.password = passwordChange.newPassword
    await user.save()
    return {
      message: 'Thay ?????i m???t kh???u th??nh c??ng, vui l??ng ????ng nh???p l???i',
      status: HttpStatusCode.OK
    }
  }
  return {
    message: 'M???t kh???u c?? kh??ng kh???p!!',
    status: HttpStatusCode.UNAUTHORIZED
  }
})

export const forgotPasswordInit = asyncHandler(async function (userMail) {
  const user = await User.findOne({ email: userMail })
  if (!user)
    return { status: HttpStatusCode.NOT_FOUND, message: 'Email kh??ng t???n t???i, vui l??ng ki???m tra l???i' }
  let token = jwt.sign(
    { _id: user._id },
    env.JWT_SECRET,
    {
      expiresIn: '15m'
    })
  let tokenSave = await Token.create({
    userId: user._id,
    tokenType: 'forgot-password',
    token: token
  })
  await tokenSave.save()
  const mailContext = `<p><a href="${env.FRONTEND_HOSTNAME}/user/forgot-password/verify?uid=${user._id}&token=${token}">Click v??o ????y reset m???t kh???u</a></p>`
  sendMail(user.email, 'LTSBANK: Reset m???t kh???u', mailContext)
  return { status: HttpStatusCode.OK, message: '???? g???i email x??c nh???n ?????i m???t kh???u, vui l??ng ki???m tra email' }
})

export const updateForgotPassword = asyncHandler(async function (userInfo) {
  const user = await User.findById(userInfo.userId)
  if (!user)
    return { status: HttpStatusCode.NOT_FOUND, message: 'User kh??ng t???n t???i, vui l??ng ki???m tra l???i' }
  user.password = userInfo.newPassword
  await user.save(user)
  await Token.deleteOne({ userId: userInfo.userId, token: userInfo.token, tokenType: 'forgot-password' })
  return { status: HttpStatusCode.OK, message: '?????i m???t kh???u th??nh c??ng, vui l??ng ????ng nh???p l???i' }
})

export const chargeMoneyInit = asyncHandler(async function (chargeInfo, res) {
  let token = jwt.sign(
    { _id: chargeInfo.userId, amount: chargeInfo.amount },
    env.JWT_SECRET,
    {
      expiresIn: '15m'
    })
  let tokenSave = await Token.create({
    userId: chargeInfo.userId,
    tokenType: 'charge',
    token: token
  })
  await tokenSave.save()
  let create_payment_json = {
    'intent': 'sale',
    'payer': {
      'payment_method': 'paypal'
    },
    'redirect_urls': {
      'return_url': `${env.FRONTEND_HOSTNAME}/user/charge/submit?token=${token}`,
      'cancel_url': `${env.FRONTEND_HOSTNAME}/user/charge/submit/fail`
    },
    'transactions': [{
      'item_list': {
        'items': [{
          'name': 'N???p ti???n v??o t??i kho???n LTS Bank',
          'sku': '001',
          'price': chargeInfo.amount,
          'currency': 'USD',
          'quantity': 1
        }]
      },
      'amount': {
        'currency': 'USD',
        'total': chargeInfo.amount
      },
      'description': 'N???p ti???n v??o t??i kho???n LTS Bank'
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
      throw new Error('Giao d???ch kh??ng t???n t???i ho???c ch??a ???????c x??c nh???n')
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
        await transactionLog.save()
        await user.updateBalance(transactionLog, service)
        await Token.deleteOne({ userId: info.userId, token: info.token, tokenType: 'charge' })
        res.status(HttpStatusCode.OK).json({ message: 'N???p ti???n t??? Paypal th??nh c??ng' })
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
  const mailContext = `<p><a href="${env.FRONTEND_HOSTNAME}/user/withdraw-money/verify?uid=${user._id}&token=${token}">Click v??o ????y ????? r??t ti???n</a></p>`
  sendMail(user.email, 'LTSBANK: X??c nh???n r??t ti???n', mailContext)
  return true
}

export const withdrawMoneyProcess = asyncHandler(async function (info, res) {
  //set id user to sender_batch_id
  var sender_batch_id = Math.random().toString(36).substring(9)
  var create_payout_json = {
    'sender_batch_header': {
      'sender_batch_id': sender_batch_id,
      'email_subject': 'R??t ti???n t??? LTS Bank'
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
        'sender_item_id': 'R??t ti???n t??? LTS Bank'
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
    return { status: HttpStatusCode.BAD_REQUEST, message: 'S??? t??i kho???n ng?????i nh???n kh??ng t???n t???i. Vui l??ng ki???m tra l???i.' }
  let checkBalance = await checkBalanceBeforeTransaction(remitter, 'CHUYEN TIEN TRONG NGAN HANG', transferInfo.amount, 'VND')
  if (!checkBalance)
    return { status: HttpStatusCode.BAD_REQUEST, message: 'S??? d?? kh??ng ????? ????? th???c hi???n giao d???ch.' }
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
  const mailContext = `<p><a href="${env.FRONTEND_HOSTNAME}/user/transfer/verify?uid=${remitter._id}&token=${token}">Click v??o ????y ????? chuy???n ti???n</a></p>`
  sendMail(remitter.email, 'LTSBANK: X??c nh???n chuy???n ti???n', mailContext)
  return { status: HttpStatusCode.OK, message: '???? g???i email x??c nh???n chuy???n ti???n, vui l??ng ki???m tra email c???a b???n.' }
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
      return { status: HttpStatusCode.BAD_REQUEST, message: 'S??? d?? kh??ng ????? ????? th???c hi???n giao d???ch.' }
    }
    const service = await Service.findOne({ service_name: 'CHUYEN TIEN TRONG NGAN HANG' }).exec()
    let transactionLog = await TransactionLog.create(await TransactionLogService.createLogTransfer(remitter, receiver, transferInfo, service))
    await transactionLog.save(opts)
    await remitter.updateBalance(transactionLog, service, opts)
    await receiver.receiveMoney(transactionLog, opts)
    await Token.deleteOne({ userId: transferInfo.remitterId, token: transferInfo.token, tokenType: 'transfer' }, opts)
    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
    console.log(error)
    return { status: HttpStatusCode.INTERNAL_SERVER, message: '???? c?? l???i x???y ra trong khi giao d???ch.' }
  } finally {
    session.endSession()
  }
  return { status: HttpStatusCode.OK, message: 'Chuy???n ti???n th??nh c??ng.' }
})

export const creditDebtPaymentInit = async function (debtInfo) {
  let user = await User.findById(debtInfo.userId)
  let checkBalance = await checkBalanceBeforeTransaction(user, 'THANH TOAN NO TIN DUNG', debtInfo.amount, 'VND')
  if (!checkBalance)
    return { status: HttpStatusCode.BAD_REQUEST, message: 'S??? d?? kh??ng ????? ????? th???c hi???n giao d???ch.' }
  const debtAmount = await CardService.checkCreditDebtPayment(debtInfo)
  if (debtAmount < 0) {
    return { status: HttpStatusCode.BAD_REQUEST, message: `S??? ti???n thanh to??n v?????t qu?? s??? ti???n n???. Vui l??ng nh???p s??? ti???n thanh to??n nh??? h??n ho???c b???ng ${-debtAmount}` }
  }
  let token = jwt.sign(
    { _id: user._id, amount: debtInfo.amount, currency: 'VND' },
    env.JWT_SECRET,
    {
      expiresIn: '15m'
    })
  let tokenSave = await Token.create({
    userId: user._id,
    tokenType: 'debt-payment',
    token: token
  })
  await tokenSave.save()
  const mailContext = `<p><a href="${env.FRONTEND_HOSTNAME}/user/debt-payment/verify?uid=${user._id}&token=${token}">Click v??o ????y ????? thanh to??n n??? t??n d???ng</a></p>`
  sendMail(user.email, 'LTSBANK: X??c nh???n thanh to??n n??? t??n d???ng', mailContext)
  return { status: HttpStatusCode.OK, message: '???? g???i email x??c nh???n thanh to??n n??? t??n d???ng, vui l??ng ki???m tra email c???a b???n.' }
}

export const creditDebtPaymentSubmit = async function (debtInfo) {
  const session = await startSession()
  await session.startTransaction()
  try {
    const opts = { session, returnOriginal: false, strict: false }
    let user = await User.findOne({ _id: debtInfo.userId })
    let checkBalance = await checkBalanceBeforeTransaction(user, 'THANH TOAN NO TIN DUNG', debtInfo.amount, 'VND')
    if (!checkBalance) {
      await session.abortTransaction()
      return { status: HttpStatusCode.BAD_REQUEST, message: 'S??? d?? kh??ng ????? ????? th???c hi???n giao d???ch.' }
    }
    const service = await Service.findOne({ service_name: 'THANH TOAN NO TIN DUNG' }).exec()
    let transactionLog = await TransactionLog.create(await TransactionLogService.createLogDebtPayment(user, debtInfo, service))
    await transactionLog.save(opts)
    await CardService.creditDebtPaymentAcceptOnCard(transactionLog, opts)
    await user.updateBalance(transactionLog, service, opts)
    await Token.deleteOne({ userId: user._id, token: debtInfo.token, tokenType: 'debt-payment' }, opts)
    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
    console.log(error)
    return { status: HttpStatusCode.INTERNAL_SERVER, message: '???? c?? l???i x???y ra trong khi giao d???ch.' }
  } finally {
    session.endSession()
  }
  return { status: HttpStatusCode.OK, message: 'Thanh to??n n??? t??n d???ng th??nh c??ng.' }
}

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
  if (fee.toCurrency.transactionAmount > fee.toCurrency.transactionFee + user.balance) {
    return false
  }
  return true
}
