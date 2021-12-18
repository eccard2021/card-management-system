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