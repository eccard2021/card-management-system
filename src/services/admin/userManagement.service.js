import User from '../../models/user.model'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../../utilities/constant'
import TransactionLog from '../../models/transactionModel'

export const getUserPagingation = asyncHandler(async function (info) {
  const listUsers = await User.aggregate([
    {
      '$match': { '_id': { '$ne': info.adminId } }
    },
    {
      '$project': {
        _id: 1, name: 1, birth: 1, isMale: 1, email: 1, accNumber: 1,
        personalIdNumber: '$personalIdNumber.number', job: '$job.title', phoneNumber: 1
      }
    },
    {
      '$skip': (info.page - 1) * info.limit
    },
    {
      '$limit': info.limit
    }
  ])
  return {
    status: HttpStatusCode.OK,
    users: listUsers
  }
})

export const getUserProfileById = asyncHandler(async function (userId) {
  return {
    status: HttpStatusCode.OK,
    user: await User.findById(userId)
  }
})

export const getTransactionLogsByUserId = asyncHandler(async function (logsInfo) {
  const logs = await TransactionLog.find({ '$or': [{ 'from.UID': logsInfo.userId }, { 'to.UID': logsInfo.userId }] })
    .select('-__v -_id')
    .skip((logsInfo.page - 1) * logsInfo.limit).limit(logsInfo.limit)
  return {
    status: HttpStatusCode.OK,
    transactionLogs: logs
  }
})

export const searchUserByProperty = asyncHandler(async function (searchInfo) {
  const matchObj = { '_id': { '$ne': searchInfo.adminId } }
  matchObj[`${searchInfo.property}`] = new RegExp(`.*${searchInfo.keyword}.*`, 'gi')
  const user = await User.aggregate([
    {
      '$project': {
        _id: 1, name: 1, birth: 1, isMale: 1, email: 1, accNumber: 1,
        personalIdNumber: '$personalIdNumber.number', job: '$job.title', phoneNumber: 1
      }
    },
    {
      '$match': matchObj
    },
    {
      '$skip': (searchInfo.page - 1) * searchInfo.limit
    },
    {
      '$limit': searchInfo.limit
    }
  ])
  return {
    status: HttpStatusCode.OK,
    user: user
  }
})

export const updateUserProfile = asyncHandler(async function (userInfo) {
  let user = await User.findById(userInfo._id)
  let { newProfile } = userInfo
  user.name = newProfile.name
  user.birth = newProfile.birth
  user.isMale = newProfile.isMale
  user.personalIdNumber.number = newProfile.personalIdNumber.number
  user.personalIdNumber.issueDate = newProfile.personalIdNumber.issueDate
  user.personalIdNumber.issuePlace = newProfile.personalIdNumber.issuePlace
  user.phoneNumber = newProfile.phoneNumber
  user.email = newProfile.email
  user.homeAddress = newProfile.homeAddress
  user.job.title = newProfile.job.title
  user.job.workAddress = newProfile.job.workAddress
  user.job.salary = newProfile.job.salary
  user.isActive = newProfile.isActive
  await user.save()
  return { status: HttpStatusCode.OK, message: 'Cập nhật thông tin thành công' }
})