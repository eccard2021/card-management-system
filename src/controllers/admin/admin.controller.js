import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../../utilities/constant'
import * as AdminService from '../../services/admin/admin.service'
import { validationResult } from 'express-validator'

export const authAdminController = asyncHandler(async function (req, res) {
  // const errors = validationResult(req)
  // if (!errors.isEmpty()) {
  //   res.status(422).json({ message: 'Email hoặc password không hợp lệ', errors: errors.array() })
  //   return
  // }
  const { email, password } = req.body
  const admin = await AdminService.findByCredentials(email, password)
  if (!admin || !admin.isAdmin) {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('Email hoặc password không hợp lệ')
  }
  res.json(admin)
})

export const getAdminProfile = asyncHandler(async function (req, res) {
  const adminId = req.admin._id
  const admin = await AdminService.getAdminProfileById(adminId)
  if (admin) {
    res.status(HttpStatusCode.OK).json(admin)
  } else {
    res.status(HttpStatusCode.NOT_FOUND)
      .json({ message: 'Không tìm thấy thông tin admin' })
  }
})

export const updateAdminProfile = asyncHandler(async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }
  const adminInfo = {
    adminId: req.admin._id,
    newProfile: req.body
  }
  try {
    const result = await AdminService.updateAdminProfile(adminInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})

export const updateAdminPassword = asyncHandler(async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }
  const adminInfo = {
    adminId: req.admin._id,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword
  }
  try {
    const result = await AdminService.updateAdminPassword(adminInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})