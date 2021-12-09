import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/user.model'
import Token from '../models/token.model'
import { HttpStatusCode } from '@src/utilities/constant'

export const protect = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      let token = req.headers.authorization.replace('Bearer ', '')
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.token = await Token.findOne({ userId: decoded._id, token: token, tokenType: 'login' })
      if (!req.token) {
        res.status(HttpStatusCode.UNAUTHORIZED)
        throw new Error('Unauthorized token')
      }
      req.user = await User.findById(req.token.userId).select('-password')
      if (!req.user) {
        res.status(HttpStatusCode.UNAUTHORIZED)
        throw new Error('Tài khoản đã bị khoá')
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

export const authForgotPassword = asyncHandler(async (req, res, next) => {
  if (req.body.token) {
    try {
      let decoded = jwt.verify(req.body.token, process.env.JWT_SECRET)
      req.token = await Token.findOne({ userId: decoded._id, token: req.body.token, tokenType: 'forgot-password' })
      if (!req.token) {
        res.status(HttpStatusCode.UNAUTHORIZED)
        throw new Error('Unauthorized token')
      }
      next()
    } catch (error) {
      res.status(HttpStatusCode.UNAUTHORIZED)
      throw new Error('Unauthorized token')
    }
  } else {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('Unauthorized token')
  }
})