import mongoose from 'mongoose'

const IntDebitSchema = mongoose.Schema({
  cardRank: { //standard, (silver), gold (dang tinh bo silver, giam tai)
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  maxPay: {
    type: Number,
    required: true
  },
  maxDraw: {
    type: Number,
    required: true
  },
  maxDrawTime: {
    type: Number,
    required: true
  },
  maxTransfer: {
    type: Number,
    required: true
  },
  issueFee: {
    type: Number,
    required: true
  },
  reIssueFee: { //phi cap lai the
    type: Number,
    required: true
  },
  rePINFee: { //phi cap lai pin
    type: Number,
    required: true
  },
  yearlyFee: {
    type: Number,
    required: true
  },
  inDrawFee: { //phi rut ngan hang trong nuoc
    type: Number,
    required: true
  },
  outDrawFee: { //phi rut ngan hang ngoai nuoc (tinh % / giao dich)
    type: Number,
    required: true
  },
  transferFee: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

const IntDebit = mongoose.model('IntDebit', IntDebitSchema)

export default IntDebit