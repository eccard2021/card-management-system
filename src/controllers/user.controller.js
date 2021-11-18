import User from '@src/models/user.model'
import { generateAccountNumber, generateRandomPassword } from '@src/utilities/user.utils'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '@src/utilities/constant'
import sendEmail from './email.controller'
import { validationResult } from 'express-validator'

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
  try {
    const user = await User.findByCredentials(email, password)
    if (!user) {
      res.status(HttpStatusCode.UNAUTHORIZED)
      throw new Error('Email hoặc password không hợp lệ')
    }
    const token = await user.generateAuthToken()
    res.cookie('token', `Bearer ${token}`, { httpOnly: true })
      .json({
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
        balance: user.balance
      })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('Email hoặc password không hợp lệ')
  }
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
    sendEmail(user.email, 'User information and password', `${JSON.stringify(user)}\npassword: ${password}`)
    res.status(HttpStatusCode.CREATED).json({ message: 'Tạo tài khoản thành công, vui lòng kiểm tra email của bạn!' })
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

export const logOutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token
    })
    await req.user.save()
    res.json({ message: 'Đăng xuất thành công' })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).send(error)
  }
}

export const logOutAll = async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length)
    await req.user.save()
    res.json({ message: 'Đăng xuất khỏi tất cả thiết bị thành công' })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).send(error)
  }
}

export { authUser, getUserProfile, registerUser, updateUserProfile }