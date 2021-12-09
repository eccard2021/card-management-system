import User from '../../models/user.model'
import asyncHandler from 'express-async-handler'

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