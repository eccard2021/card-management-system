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
    const result = await CardTypeService.updateCardType(cardInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})

export const getCardByTypeAndUrlPath = asyncHandler(async function (req, res) {
  let cardInfo = {
    cardType: req.params.cardType,
    urlPath: req.params.urlPath
  }
  try {
    const result = await CardTypeService.getCardByTypeAndUrlPath(cardInfo)
    res.status(result.status).json(result.message)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER)
    throw new Error('Lỗi hệ thống')
  }
})

export const getListCardsByType = asyncHandler(async function (req, res) {
  const cardTypeInfo = {
    cardType: req.params.cardType,
    page: req.query.page || 1,
    limit: 10
  }
  try {
    const result = await CardTypeService.getListCardsByType(cardTypeInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    res.status(HttpStatusCode.OK)
    throw new Error('Lỗi hệ thống')
  }
})

export const createCard = asyncHandler(async function (req, res) {
  const cardInfo = {
    cardType: req.params.cardType,
    cardTypeId: req.query.cardTypeId,
    card: req.body
  }
  try {
    const result = await CardTypeService.createCard(cardInfo)
    res.status(result.status).json({ message: result.message })
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ message: 'Lỗi hệ thống' })
  }
})