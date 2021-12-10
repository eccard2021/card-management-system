import User from '../../models/user.model'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../../utilities/constant'

export const findByCredentials = asyncHandler(async function (email, password) {
  let admin = await User.findByCredentials(email, password)
  if (!admin) {
    return admin
  }
  let token = await admin.generateAuthToken()
  return {
    _id: admin._id,
    name: admin.name,
    birth: admin.birth,
    isMale: admin.isMale,
    personalIdNumber: admin.personalIdNumber,
    phoneNumber: admin.phoneNumber,
    email: admin.email,
    homeAddress: admin.homeAddress,
    job: admin.job,
    accNumber: admin.accNumber,
    isAdmin: admin.isAdmin,
    balance: admin.balance,
    token: token
  }
})

export const getAdminProfileById = asyncHandler(async function (adminId) {
  return await User.findById(adminId)
    .select('-password -__v -balanceFluctuations')
})

export const updateAdminProfile = asyncHandler(async function (adminInfo) {
  let admin = await User.findById(adminInfo.adminId)
  let { newProfile } = adminInfo
  admin.name = newProfile.name
  admin.birth = newProfile.birth
  admin.isMale = newProfile.isMale
  admin.personalIdNumber.number = newProfile.personalIdNumber.number
  admin.personalIdNumber.issueDate = newProfile.personalIdNumber.issueDate
  admin.personalIdNumber.issuePlace = newProfile.personalIdNumber.issuePlace
  admin.phoneNumber = newProfile.phoneNumber
  admin.email = newProfile.email
  admin.homeAddress = newProfile.homeAddress
  admin.job.title = newProfile.job.title
  admin.job.workAddress = newProfile.job.workAddress
  admin.job.salary = newProfile.job.salary
  await admin.save()
  return { status: HttpStatusCode.OK, message: 'Cập nhật thông tin thành công' }
})

export const updateAdminPassword = asyncHandler(async function (adminInfo) {
  let admin = await User.findById(adminInfo.adminId)
  if (adminInfo.currentPassword && (await admin.matchPassword(adminInfo.currentPassword))) {
    admin.password = adminInfo.newPassword
    await admin.save()
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