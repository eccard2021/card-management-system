import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '@src/models/user.model'
import { HttpStatusCode } from '@src/utilities/constant'

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token
  try {
    if (!token.startsWith('Bearer')) {
      res.status(HttpStatusCode.UNAUTHORIZED)
      throw new Error()
    }
    req.token = token.replace('Bearer ', '')
    const decoded = jwt.verify(req.token, process.env.JWT_SECRET)
    req.user = await User.findOne({ _id: decoded._id, 'tokens.token': req.token }).select('-password')
    if (!req.user) {
      res.status(HttpStatusCode.UNAUTHORIZED)
      throw new Error()
    }
    next()
  } catch (error) {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('failed to authorized')
  }
})

export { protect }