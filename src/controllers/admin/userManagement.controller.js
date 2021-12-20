import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../../utilities/constant'
import * as UserManagementService from '../../services/admin/userManagement.service'

export const getAllUsers = asyncHandler(async function (req, res) {
  const info = {
    page: req.query.page || 1,
    limit: 5,
    adminId: req.admin._id
  }
  try {
    const result = await UserManagementService.getUserPagingation(info)
    res.status(result.status).json(result.users)
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})

export const getUserProfileById = asyncHandler(async function (req, res) {
  const userId = req.query._id
  try {
    const result = await UserManagementService.getUserProfileById(userId)
    res.status(result.status).json(result.user)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})

export const getTransactionLogDetails = asyncHandler(async function (req, res) {
  const logId = req.query.logId
  try {
    const result = await UserManagementService.getTransactionLogsByUserId(logId)
    res.status(result.status).json(result.transactionLog)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})

export const searchUser = asyncHandler(async function (req, res) {
  const searchInfo = {
    property: req.query.property,
    keyword: req.query.keyword,
    adminId: req.admin._id,
    page: req.query.page || 1,
    limit: 10
  }
  try {
    const result = await UserManagementService.searchUserByProperty(searchInfo)
    res.status(result.status).json(result.user)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})

export const updateUserProfile = asyncHandler(async function (req, res) {
  const userInfo = req.body
  try {
    const result = await UserManagementService.updateUserProfile(userInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})