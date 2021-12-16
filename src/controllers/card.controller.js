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
