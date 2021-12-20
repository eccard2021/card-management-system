import CardList from '../models/cardList.model'
import { HttpStatusCode } from '../utilities/constant'

export const getAllCardByUserID = async function (userId) {
  const listCard = await CardList.find({ accOwner: userId })
    .select('-__v -PIN -accOwner')
    .populate('cardTypeId', 'publisher cardName cardRank')
  return {
    status: HttpStatusCode.OK,
    listCard: listCard
  }
}

export const deactiveCardById = async function (cardId) {
  const card = await CardList.findById(cardId)
  if (!card)
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Thẻ không tồn tại'
    }
  if (card.isActive === false)
    return {
      status: HttpStatusCode.OK,
      message: 'Thẻ này đang bị khoá'
    }
  card.isActive = false
  await card.save()
  return {
    status: HttpStatusCode.OK,
    message: 'Khoá thẻ thành công'
  }
}

export const activeCardById = async function (cardId) {
  const card = await CardList.findById(cardId)
  if (!card)
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Thẻ không tồn tại'
    }
  if (card.isActive === true)
    return {
      status: HttpStatusCode.OK,
      message: 'Thẻ đang hoạt động'
    }
  card.isActive = true
  await card.save()
  return {
    status: HttpStatusCode.OK,
    message: 'Mở khoá thẻ thành công'
  }
}


export const creditDebtPaymentAcceptOnCard = async function (transactionLog, opts) {
  await CardList.updateOne(
    { accOwner: transactionLog.from.UID, cardType: 'IntCredits' },
    [
      {
        $set: {
          debt: {
            $subtract: ['$debt', transactionLog.fromCurrency.transactionAmount]
          }
        }
      }
    ],
    opts
  )
}

export const creditPaymentUpdate = async function (transactionLog, card, opts) {
  await CardList.updateOne(
    { _id: card._id },
    [
      {
        $set: {
          currentUsed: {
            $add: ['$currentUsed', transactionLog.fromCurrency.transactionAmount]
          }
        }
      }
    ],
    opts
  )
}

export const checkCreditDebtPayment = async function (debtInfo) {
  const card = await CardList.findOne({ accOwner: debtInfo.userId, cardType: 'IntCredits' })
  return card.debt - Number(debtInfo.amount)
}