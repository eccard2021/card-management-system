import mongoose from 'mongoose'

const domDebitSchema = mongoose.Schema({
  cardRank: { //standard, (silver), gold (dang tinh bo silver, giam tai)
    type: String,
    required: true
  },
  description: {
    type: String,
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
  inDrawFee: { //phi rut cung ngan hang
    type: Number,
    required: true
  },
  outDrawFee: { //phi rut khac ngan hang
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

const domDebit = mongoose.model('domDebit', domDebitSchema)

export default domDebit