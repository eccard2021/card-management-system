import User from '../../models/user.model'
import env from '../../config/environment'
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
  if (!admin) {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('Email hoặc password không hợp lệ')
  }
  res.json(admin)
})