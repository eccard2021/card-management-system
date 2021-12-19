import { HttpStatusCode } from '../../utilities/constant'
import asyncHandler from 'express-async-handler'
import { IntCredits, IntDebits, DomDebits } from '../../models/cardTypes.model'
import CardList from '../../models/cardList.model'

const combination = {
  intCredits: {
    model: IntCredits,
    fields: ['isIssuing', 'publisher', 'cardName', 'image', 'cardRank', 'description', 'creditLine',
      'condition', 'statmentDay', 'payWithin', 'interestRate', 'issueFee', 'yearlyFee', 'exCurrency']
  },
  intDebits: {
    model: IntDebits,
    fields: ['isIssuing', 'publisher', 'cardName', 'image', 'cardRank',
      'description', 'maxPay', 'issueFee', 'yearlyFee', 'exCurrency']
  },
  domDebits: {
    model: DomDebits,
    fields: ['isIssuing', 'publisher', 'cardName', 'image', 'cardRank',
      'description', 'issueFee', 'yearlyFee']
  }
}

export const createCardType = asyncHandler(async (newCardInfo) => {
  let info = newCardInfo.info
  let cardType = newCardInfo.cardType
  if (!combination[cardType]) {
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Không tìm thấy loại thẻ tương ứng'
    }
  }
  let newCard = {}
  for (let field of combination[cardType].fields) {
    newCard[field] = info[field]
  }
  let saveCard
  try {
    saveCard = await combination[cardType].model.create(newCard)
    await saveCard.save()
  } catch (error) {
    if (error.code === 11000)
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: 'Tên thẻ đã bị trùng!'
      }
    else
      throw error
  }
  return {
    status: HttpStatusCode.OK,
    message: saveCard
  }
})

export const updateCardType = asyncHandler(async function (cardInfo) {
  let info = cardInfo.info
  let cardType = cardInfo.cardType
  if (!combination[cardType]) {
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Không tìm thấy loại thẻ tương ứng'
    }
  }
  console.log(info)
  let oldCard = await combination[cardType].model.findById(info._id)
  if (!oldCard) {
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Không tìm thấy loại thẻ tương ứng'
    }
  }
  try {
    for (let field of combination[cardType].fields) {
      oldCard[field] = info[field]
      oldCard.markModified(field)
    }
    await oldCard.save()
  } catch (error) {
    if (error.code === 11000)
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: 'Tên thẻ đã bị trùng!'
      }
    else
      throw error
  }
  return {
    status: HttpStatusCode.OK,
    message: oldCard
  }
})

export const getCardByTypeAndUrlPath = asyncHandler(async function (cardInfo) {
  if (!combination[cardInfo.cardType]) {
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Không tìm thấy loại thẻ tương ứng'
    }
  }
  let cardType = await combination[cardInfo.cardType].model.findOne({ cardUrl: cardInfo.urlPath })
  if (!cardType) {
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Không tìm thấy thông tin thẻ'
    }
  }
  return {
    status: HttpStatusCode.OK,
    message: cardType
  }
})

export const getListCardsByType = asyncHandler(async function (cardTypeInfo) {
  if (!combination[cardTypeInfo.cardType]) {
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Không tìm thấy loại thẻ tương ứng'
    }
  }
  let listCardType = await combination[cardTypeInfo.cardType].model.find()
  return {
    status: HttpStatusCode.OK,
    message: listCardType
  }
})

export const createCard = async function (cardInfo) {
  if (!combination[cardInfo.cardType]) {
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Không tìm thấy loại thẻ'
    }
  }
  const cardType = await combination[cardInfo.cardType].model.findById(cardInfo.cardTypeId)
  console.log(cardInfo)
  if (!cardType) {
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Không tìm thấy loại thẻ'
    }
  }
  let card = await CardList.create({
    cardNumber: cardInfo.card.cardNumber,
    publisher: cardInfo.card.publisher,
    CVV: cardInfo.card.CVV,
    PIN: '000000',
    isActive: false,
    accOwner: null,
    validDate: null,
    expiredDate: null,
    cardTypeId: cardType._id,
    cardType: cardInfo.cardType.charAt(0).toUpperCase() + cardInfo.cardType.substring(1),
    currentUsed: 0
  })
  await card.save()
  return {
    status: HttpStatusCode.OK,
    message: 'Thêm thẻ mới thành công'
  }
}