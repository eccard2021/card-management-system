import User from '@src/models/user.model'
import generateToken from '@src/utilities/generateToken.js'
import { generateAccountNumber, generateRandomPassword } from '@src/utilities/user.utils'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '@src/utilities/constant'
import sendEmail from './email.controller'

//@desc auth user and get token
//@route POST /api/users/login
//@access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  //response user information to front-end
  if (user && (await user.matchPassword(password))) {
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
      token: generateToken(user._id)
    })
  } else {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('Invalid email or password')
  }

})

//@desc REGISTER new user
//@route POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
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
  let user = await User.findById(req.user._id)
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
  const user = await User.findById(req.user._id)

  if (user) {
    if (req.body.currentPassword && (await user.matchPassword(req.body.currentPassword))) {
      if (req.body.newPassword === req.body.confirmNewPassword) {
        user.password = req.body.newPassword
        const updatedUser = await user.save()
        res.json({ message: 'Thay đổi mật khẩu thành công, vui lòng đăng nhập lại' })
      } else {
        res.json({ message: 'Mật khẩu xác nhận không khớp' })
      }
    } else {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Mật khẩu cũ không khớp!!' })
    }
  } else {
    res.status(HttpStatusCode.NOT_FOUND)
    throw new Error('user not found')
  }
})

export { authUser, getUserProfile, registerUser, updateUserProfile }