import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/user.model'
import Token from '../models/token.model'
import { HttpStatusCode } from '@src/utilities/constant'

export const authAdmin = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      let token = req.headers.authorization.replace('Bearer ', '')
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.token = await Token.findOne({ userId: decoded._id, token: token, tokenType: 'login' })
      if (!req.token) {
        res.status(HttpStatusCode.UNAUTHORIZED)
        throw new Error('Unauthorized token')
      }
      req.admin = await User.findOne({ _id: req.token.userId }).select('-password')
      if (!req.admin.isAdmin) {
        res.status(HttpStatusCode.UNAUTHORIZED)
        throw new Error('Error')
      }
      next()
    } catch (error) {
      console.error(error)
      res.status(HttpStatusCode.UNAUTHORIZED)
      throw new Error('Unauthorized token')
    }
  } else {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('Unauthorized token')
  }
})
