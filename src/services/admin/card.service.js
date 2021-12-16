import CardList from '../../models/cardList.model'

export const checkUserHaveCardType = async function (order) {
  const card = await CardList.findOne({ accOwner: order.orderOwner, cardType: order.cardType })
  if (!card)
    return false
  return true
}

export const registCardForUser = async function (order) {
  let PIN = '111111'
  const card = await CardList.findOne({ accOwner: null, cardType: order.cardType, cardTypeId: order.cardTypeId })
  card.accOwner = order.orderOwner
  card.isActive = true
  card.validDate = new Date()
  card.expiredDate = new Date()
  card.expiredDate.setFullYear(card.validDate.getFullYear() + 10)
  card.PIN = PIN
  await card.save()
  return card
}