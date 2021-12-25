import mongoose from 'mongoose'

const paymentGateSchema = mongoose.Schema({
  gateOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  isGlobal: {
    type: Boolean,
    required: true,
    default: false
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  apiKey: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})


const PaymentGate = mongoose.model('paymentGate', paymentGateSchema)

export default PaymentGate