import mongoose from 'mongoose'

const cardListSchema = mongoose.Schema({
  cardNumber: {
    type: String,
    unique: true,
    required: true
  },
  PIN: {
    type: String,
    required: true
  },
  CVV: {
    type: String,
    required: true
  },
  cardName: { //standard, (silver), gold (dang tinh bo silver, giam tai)
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false
  },
  isOwned: {
    type: Boolean,
    required: true,
    default: false
  },
  accOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    default: null
  },
  validDate: {
    type: Date,
    require: true
  },
  expiredDate: {
    type: Date,
    required: true
  },
  cardType: { //Xác định là GC, GD hay LD
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const cardList = mongoose.model('cardList', cardListSchema)

export default cardList