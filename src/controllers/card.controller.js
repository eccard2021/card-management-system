import IntCredit from '@src/models/intCredit.model'
import IntDebit from '@src/models/intDebit.model'
import domDebit from '@src/models/domDebit.model'
import asyncHandler from 'express-async-handler'
import { HttpStatusCode } from '@src/utilities/constant'

export const createCardType = asyncHandler(async (req, res) => {

})

export const getOneCardType = asyncHandler(async (req, res) => {

})

export const getAllCardTypes = asyncHandler(async (req, res) => {
  const allCards = {
    intCrebit: await IntCredit.find().select(['-__v', '-createdAt', '-updatedAt'])
  }
  if (allCards) {
    res.json(allCards)
  } else {
    res.status(HttpStatusCode.NOT_FOUND)
    throw new Error('Cards not found')
  }
})

export const updateCardType = asyncHandler(async (req, res) => {

})

export const deleteCardType = asyncHandler(async (req, res) => {

})