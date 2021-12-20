import CardList from '../../models/cardList.model'
import { randomPIN } from '../../utilities/cardType.utils'

export const checkUserHaveCardType = async function (order) {
  const card = await CardList.findOne({ accOwner: order.orderOwner, cardType: order.cardType })
  if (!card)
    return false
  return true
}

export const checkUserOwnCard = async function (order) {
  const card = await CardList.findOne({ accOwner: order.orderOwner, _id: order.cardId })
  if (!card)
    return false
  return true
}

export const registCardForUser = async function (order) {
  let PIN = randomPIN()
  let card = null
  if (order.cardType === 'IntCredits')
    card = await CardList.findOneAndUpdate(
      { accOwner: null, cardType: order.cardType, cardTypeId: order.cardTypeId }
    ).set('debt', 0, Number)
  else
    card = await CardList.findOne(
      { accOwner: null, cardType: order.cardType, cardTypeId: order.cardTypeId }
    )
  card.accOwner = order.orderOwner
  card.isActive = true
  card.validDate = new Date()
  card.expiredDate = new Date()
  card.expiredDate.setFullYear(card.validDate.getFullYear() + 10)
  card.PIN = PIN
  await card.save()
  card.PIN = PIN
  return card
}

export const cancelCard = async function (order) {
  const card = await CardList.findOneAndDelete({ _id: order.cardId })
  return card
}
