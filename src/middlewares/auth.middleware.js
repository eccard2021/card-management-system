import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '@src/models/user.model'
import { HttpStatusCode } from '@src/utilities/constant'

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.replace('Bearer ', '')
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).select('-password')
      if (!req.user) {
        res.status(HttpStatusCode.UNAUTHORIZED)
        throw new Error('Unauthorized token')
      }
      next()
    } catch (error) {
      console.error(error)
      res.status(HttpStatusCode.UNAUTHORIZED)
      throw new Error('Unauthorized token')
    }
  }
})

export { protect }