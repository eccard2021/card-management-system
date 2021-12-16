import PaymentGate from '../../models/paymentGate.model'
import { generateRandomPassword } from '../../utilities/user.utils'

export const checkUserHavePaymentGateway = async function (order) {
  const gateway = await PaymentGate.findOne({ gateOwner: order.orderOwner, isGlobal: order.globalGate })
  if (!gateway)
    return false
  return true
}

export const registPaymentGateway = async function (order) {
  let gateway = await PaymentGate.create({
    gateOwner: order.orderOwner,
    isGlobal: order.globalGate,
    apiKey: generateRandomPassword(50)
  })
  await gateway.save()
  return gateway
}