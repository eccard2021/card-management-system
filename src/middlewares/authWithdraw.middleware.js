import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/user.model'
import Token from '../models/token.model'
import { HttpStatusCode } from '@src/utilities/constant'

export const authWithdrawMoney = asyncHandler(async (req, res, next) => {
  if (req.body.token) {
    try {
      req.withdrawInfo = jwt.verify(req.body.token, process.env.JWT_SECRET)
      const auth = await Token.findOne({ userId: req.withdrawInfo._id, token: req.body.token, tokenType: 'withdraw' })
      if (!auth) {
        res.status(HttpStatusCode.UNAUTHORIZED)
        throw new Error('Không có thông tin giao dịch')
      }
      next()
    } catch (error) {
      console.log(error);
      res.status(HttpStatusCode.UNAUTHORIZED)
      throw new Error('Không có thông tin giao dịch')
    }
  } else {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('Không có thông tin giao dịch')
  }
})