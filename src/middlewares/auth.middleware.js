import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '@src/models/user.model'
import { HttpStatusCode } from '@src/utilities/constant'

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.error(error)
      res.status(HttpStatusCode.UNAUTHORIZED)
      throw new Error('failed to authorized')
    }
  }
  if (!token) {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('unauthorized, no token found')
  }
})

export { protect }