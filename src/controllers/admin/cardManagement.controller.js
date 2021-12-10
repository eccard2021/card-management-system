import asyncHandler from 'express-async-handler'
import * as CardTypeService from '../../services/admin/cardType.service'
import { HttpStatusCode } from '../../utilities/constant'

export const createCardType = asyncHandler(async function (req, res) {
  let newCardInfo = {
    cardType: req.params.cardType,
    info: req.body
  }
  try {
    const result = await CardTypeService.createCardType(newCardInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})

export const updateCardType = asyncHandler(async function (req, res) {
  let cardInfo = {
    cardType: req.params.cardType,
    info: req.body
  }
  try {
    const result = await CardTypeService.createCardType(cardInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})