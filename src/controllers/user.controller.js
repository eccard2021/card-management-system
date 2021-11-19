import User from '@src/models/user.model'
import env from '../config/environment'
import { generateAccountNumber, generateRandomPassword } from '@src/utilities/user.utils'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../utilities/constant'
import sendEmail from './email.controller'
import { validationResult } from 'express-validator'
import paypal from 'paypal-rest-sdk'


//@desc auth user and get token
//@route POST /api/users/login
//@access public
const authUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ message: 'Email hoặc password không hợp lệ', errors: errors.array() })
    return
  }
  const { email, password } = req.body
  const user = await User.findByCredentials(email, password)
  if (!user) {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('Email hoặc password không hợp lệ')
  }
  const token = await user.generateAuthToken()
  //response user information to front-end
  res.json({
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
  })

})

//@desc REGISTER new user
//@route POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ message: 'Lỗi đăng kí người dùng!!!', errors: errors.array() })
    return
  }
  const newUser = req.body
  const userExists = await User.findOne({ email: newUser.email })
  if (userExists) {
    res.status(HttpStatusCode.BAD_REQUEST)
    throw new Error('Người dùng đã tồn tại!!')
  }
  let user, password = generateRandomPassword()
  try {
    let numberOfUser = (await User.count({})) + 1
    user = await User.create({
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
      balance: 0
    })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Internal server error')
  }
  if (user) {
    try {
      sendEmail(user.email, 'User information and password', `${JSON.stringify(user)}\npassword: ${password}`)
      res.status(HttpStatusCode.CREATED).json({ message: 'Tạo tài khoản thành công, vui lòng kiểm tra email của bạn!' })
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Không thể gửi email!!' })
    }
  }
  else {
    res.status(HttpStatusCode.BAD_REQUEST)
    throw new Error('Invalid user data')
  }
})

//@desc get user profile
//@route GET /api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
  let user = await User.findById(req.user._id).select('-password -tokens -__v')
  if (user) {
    res.json(user)
  }
  else {
    res.status(HttpStatusCode.NOT_FOUND)
    throw new Error('User not found')
  }
})

//@desc update user profile
//@route PUT /api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }
  const user = await User.findById(req.user._id)

  if (user) {
    if (req.body.currentPassword && (await user.matchPassword(req.body.currentPassword))) {
      user.password = req.body.newPassword
      await user.save()
      res.json({ message: 'Thay đổi mật khẩu thành công, vui lòng đăng nhập lại' })
    } else {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Mật khẩu cũ không khớp!!' })
    }
  } else {
    res.status(HttpStatusCode.NOT_FOUND)
    throw new Error('User not found')
  }
})

export const logOutUser = asyncHandler(async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token
    })
    await req.user.save()
    res.json({ message: 'Đăng xuất thành công' })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi khi đăng xuất khỏi thiết bị')
  }
})

export const logOutAll = asyncHandler(async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length)
    await req.user.save()
    res.json({ message: 'Đăng xuất khỏi tất cả thiết bị thành công' })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi khi đăng xuất khỏi tất cả thiết bị')
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
  let create_payment_json = {
    'intent': 'sale',
    'payer': {
      'payment_method': 'paypal'
    },
    'redirect_urls': {
      'return_url': `http://${env.APP_HOST}:8080/v1/user/charge/submit`,
      'cancel_url': `http://${env.APP_HOST}:5500/testPayPalFail.html`
    },
    'transactions': [{
      'item_list': {
        'items': [{
          'name': 'Nạp tiền vào tài khoản LTS Bank',
          'sku': '001',
          'price': req.body.amount,
          'currency': 'USD',
          'quantity': 1
        }]
      },
      'amount': {
        'currency': 'USD',
        'total': req.body.amount
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
        }
      }
    }
  })
})

export const chargeSubmitUser = asyncHandler(async (req, res) => {
  const payerId = req.query.PayerID
  const paymentId = req.query.paymentId
  if (!payerId || !paymentId) {
    res.status(HttpStatusCode.NOT_FOUND)
    throw new Error('Không tìm thấy payerId hoặc paymentId')
  }
  paypal.payment.get(paymentId, (error, chargeInfo) => {
    if (error) {
      res.status(HttpStatusCode.NOT_FOUND)
      throw error
    }
    const execute_payment_json = {
      'payer_id': chargeInfo.payer.payer_info.payer_id,
      'transactions': [{
        'amount': chargeInfo.transactions[0].amount
      }]
    }
    paypal.payment.execute(paymentId, execute_payment_json, (error, chargeSuccess) => {
      if (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).send(error)
        throw error
      } else {
        //pass req.user into processAfterChargeSuccess
        processAfterChargeSuccess()
        res.status(HttpStatusCode.OK).json({ message: 'Nạp tiền từ Paypal thành công' })
      }
    })
  })
})

const processAfterChargeSuccess = asyncHandler(async (user, chargeSuccess) => {

})

export const withdrawMoneyUser = asyncHandler(async (req, res) => {

})

export const withdrawMoneySubmitUser = asyncHandler(async (req, res) => {
  //set id user to sender_batch_id
  var sender_batch_id = Math.random().toString(36).substring(9)
  console.log(req.body)
  var create_payout_json = {
    'sender_batch_header': {
      'sender_batch_id': sender_batch_id,
      'email_subject': 'Rút tiền từ LTS Bank'
    },
    'items': [
      {
        'recipient_type': 'EMAIL',
        'amount': {
          'value': req.body.money,
          'currency': 'USD'
        },
        'receiver': req.body.email,
        'note': 'Thank you.',
        'sender_item_id': 'Rút tiền từ LTS Bank'
      }
    ]
  }
  const SYNC_MODE = 'false'
  paypal.payout.create(create_payout_json, SYNC_MODE, (error, withdrawInfo) => {
    if (error) {
      console.log(error)
      throw error
    } else {
      //pass req.user and withdrawInfo into processAfterWithdrawSuccess
      processAfterWithdrawSuccess()
    }
  })
})

const processAfterWithdrawSuccess = asyncHandler(async (user, withdrawInfo) => {

})

export { authUser, getUserProfile, registerUser, updateUserProfile }