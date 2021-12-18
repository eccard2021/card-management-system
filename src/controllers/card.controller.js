import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '../utilities/constant'
import * as CardListService from '../services/card.service'


export const getAllCardByUserId = asyncHandler(async function (req, res) {
  const userId = req.user._id
  try {
    const result = await CardListService.getAllCardByUserID(userId)
    res.status(result.status).json(result.listCard)
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Lỗi hệ thống' })
  }
})

export const deactiveCard = asyncHandler(async function (req, res) {
  const cardId = req.body.cardId
  try {
    const result = await CardListService.deactiveCardById(cardId)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Lỗi hệ thống' })
  }
})

export const activeCard = asyncHandler(async function (req, res) {
  const cardId = req.body.cardId
  try {
    const result = await CardListService.activeCardById(cardId)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Lỗi hệ thống' })
  }
})
