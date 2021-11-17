import { standardizeCardNameForUrl } from '../utilities/cardType.utils'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '@src/utilities/constant'
import { IntCredits, IntDebits, DomDebits } from '../models/cardTypes.model'

const combination = {
  intCredits: IntCredits,
  intDebits: IntDebits,
  domDebits: DomDebits
}

const findCardByTypeAndUrlPath = async (type, urlPath) => {
  try {
    let card = await combination[type].findOne({ cardUrl: urlPath })
    return card
  }
  catch (error) {
    throw new Error('Not Found')
  }
}

export const createCardType = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('You aren\'t admin!!!')
  }
  let value = req.body
  value.cardUrl = standardizeCardNameForUrl(value.cardName)
  try {
    await combination[value.cardType].create(value)
  }
  catch (error) {
    if (error.code === 11000)
      throw new Error('Tên thẻ bị trùng!!!')
    else {
      res.status(HttpStatusCode.NOT_FOUND)
      throw new Error('Not Found')
    }
  }
  res.json({ message: 'Tạo thẻ thành công' })
})

export const getCardByTypeAndUrlPath = asyncHandler(async (req, res) => {
  let card = await findCardByTypeAndUrlPath(req.params.cardType, req.params.urlPath)
  if (!card) {
    res.status(HttpStatusCode.NOT_FOUND)
    throw new Error('Not Found')
  }
  card = card.toObject()
  card.cardType = req.params.cardType
  res.json(card)
})

export const getOneCardType = asyncHandler(async (req, res) => {
  if (!req.params.cardType || !combination[req.params.cardType]) {
    res.status(HttpStatusCode.NOT_FOUND)
    throw new Error('Not Found')
  }
  let cards = await combination[req.params.cardType].find({}).select('-_id -__v -createdAt -updatedAt').lean()
  res.json(cards)
})

export const getAllCardTypes = asyncHandler(async (req, res) => {
  let GC = await combination.intCredits.find().select('-_id -__v -createdAt -updatedAt').lean()
  let GD = await combination.intDebits.find().select('-_id -__v -createdAt -updatedAt').lean()
  let DD = await combination.domDebits.find().select('-_id -__v -createdAt -updatedAt').lean()
  if (!GC || !GD || !DD) {
    res.status(HttpStatusCode.NOT_FOUND)
    throw new Error('Cards not found')
  }
  const allCards = {
    intCredits: GC,
    intDebits: GD,
    domDebits: DD
  }
  res.json(allCards)
})

export const updateCardType = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('You aren\'t admin!!!')
  }
  let value = req.body
  let card = await findCardByTypeAndUrlPath(value.cardType, value.cardUrl)
  try {
    for (let key in value) {
      if (key !== '_id' && key !== 'cardUrl' && card.get(key)) {
        card[key] = value[key]
        card.markModified(value.cardType)
      }
    }
    await card.save()
  }
  catch (error) {
    console.log(error)
    throw new Error('Not Found')
  }
  let newCard = await findCardByTypeAndUrlPath(value.cardType, value.cardUrl).select('-_id -__v -createdAt -updatedAt').lean()
  if (!newCard) {
    res.status(HttpStatusCode.NOT_FOUND)
    throw new Error('Not Found')
  }
  newCard = newCard.toObject()
  newCard.cardType = value.cardType
  res.json(newCard)
})

export const deleteCardType = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('You aren\'t admin!!!')
  }
  let value = req.body
  try {
    combination[value.cardType].findOneAndRemove({ cardUrl: value.cardUrl }, (err) => {
      if (err) {
        res.status(HttpStatusCode.BAD_REQUEST).send(err.message)
      }
    })
  }
  catch (error) {
    console.log(error)
    throw new Error('Not Found')
  }
  res.json({ message: 'Xoá thẻ thành công' })
})