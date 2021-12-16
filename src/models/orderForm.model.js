import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const orderFormSchema = mongoose.Schema({

  orderType: {
    type: String,
    required: true,
    enum: ['CARD_Init', 'CARD_Cancel', 'PaymentGate_Init', 'PaymentGate_Cancel', 'Re_PIN']
  },
  status: {
    type: String,
    required: true,
    default: 'processing',
    enum: ['approve', 'processing', 'deny']
  },
  orderOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  cusCmt: {
    type: String,
    default: null
  },
  bankCmt: {
    type: String,
    default: null
  },
  /////////////CARD_init
  cardTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'cardType'
  },
  cardType: {
    type: String,
    enum: ['IntCredits', 'IntDebits', 'DomDebits']
  },
  /////////////CARD_Cancel or Re_PIN
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cardList'
  },
  /////////////PaymentGate_init
  globalGate: {
    type: Boolean
  },
  /////////////PaymentGate_Cancel
  gateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'paymentGate'
  }

}, {
  timestamps: true
})
orderFormSchema.plugin(aggregatePaginate)

const OrderForm = mongoose.model('orderForm', orderFormSchema)

export default OrderForm