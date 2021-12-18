import PaymentGate from '../models/paymentGate.model'
import { HttpStatusCode } from '../utilities/constant'

export const getAllPaymentGatewayByUserID = async function (userId) {
  const listGateway = await PaymentGate.find({ gateOwner: userId })
    .select('-__v')
  return {
    status: HttpStatusCode.OK,
    listGateway: listGateway
  }
}