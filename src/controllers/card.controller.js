import CardType from '../models/cardTypes.model'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '@src/utilities/constant'

const findCardByTypeAndId = async (type, id) => {
  let card = await CardType.findOne({})
  try {
    return card[type].id(id)
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
  let card = await CardType.findOne({})
  try {
    card[value.cardType].push(value)
    card.markModified(value.cardType)
    await card.save()
  }
  catch (error) {
    console.log(error)
    throw new Error('Not Found')
  }
  res.json({ message: 'Tạo thẻ thành công' })
})

export const getCardByTypeAndId = asyncHandler(async (req, res) => {
  let card = await findCardByTypeAndId(req.params.cardType, req.params._id)
  if (!card) {
    res.status(HttpStatusCode.NOT_FOUND)
    throw new Error('Not Found')
  }
  card = card.toObject()
  card.cardType = req.params.cardType
  res.json(card)
})

export const getOneCardType = asyncHandler(async (req, res) => {
  let cards = await CardType.findOne({})
  if (!cards[req.params.cardType]) {
    res.status(HttpStatusCode.NOT_FOUND)
    throw new Error('Not Found')
  }
  res.json(cards[req.params.cardType])
})

export const getAllCardTypes = asyncHandler(async (req, res) => {
  const allCards = await CardType.findOne().select([
    '-_id',
    '-__v',
    '-createdAt',
    '-updatedAt'
  ])
  if (!allCards) {
    res.status(HttpStatusCode.NOT_FOUND)
    throw new Error('Cards not found')
  }
  res.json(allCards)
})

export const updateCardType = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(HttpStatusCode.UNAUTHORIZED)
    throw new Error('You aren\'t admin!!!')
  }
  let value = req.body
  let card = await CardType.findOne({})
  try {
    for (let key in value) {
      if (key !== '_id' && card[value.cardType].id(value._id).get(key))
        card[value.cardType].id(value._id)[key] = value[key]
    }
    card.markModified(value.cardType)
    await card.save()
  }
  catch (error) {
    console.log(error)
    throw new Error('Not Found')
  }
  let newCard = await findCardByTypeAndId(value.cardType, value._id)
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
  let card = await CardType.findOne({})
  try {
    card[value.cardType].id(value._id).remove((removeerr, removresult) => {
      if (removeerr) {
        res.status(HttpStatusCode.BAD_REQUEST).send(removeerr.message)
      }
    })
    card.markModified(value.cardType)
    await card.save()
  }
  catch (error) {
    console.log(error)
    throw new Error('Not Found')
  }
  res.json({ message: 'Xoá thẻ thành công' })
})