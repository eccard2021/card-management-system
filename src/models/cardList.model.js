import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const CardListSchema = mongoose.Schema({
  cardNumber: {
    type: String,
    unique: true,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  CVV: {
    type: String,
    required: true
  },
  PIN: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false
  },
  accOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    default: null
  },
  validDate: {
    type: Date,
    default: null
  },
  expiredDate: {
    type: Date,
    default: null
  },
  cardTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'cardType'
  },
  cardType: {
    type: String,
    required: true,
    enum: ['IntCredits', 'IntDebits', 'DomDebits']
  },
  currentUsed: { //hiện dụng
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true,
  strict: false
})

CardListSchema.methods.matchPIN = async function (enteredPIN) {
  return await bcrypt.compare(enteredPIN, this.PIN)
}

CardListSchema.methods.matchCVV = async function (enteredCVV) {
  return enteredCVV === this.CVV
}

CardListSchema.methods.matchExpiredDate = async function (enteredExpiredDate) {
  const thisdate = new Date(this.expiredDate)
  const enteredExDate = enteredExpiredDate.split('/')
  return (thisdate.getMonth() + 1 == Number(enteredExDate[0])) && thisdate.getFullYear() == Number(enteredExDate[1])
}

//--------------------------------------HOOKS--------------------------------------------

CardListSchema.pre('insertMany', async function (next, docs) {
  if (Array.isArray(docs) && docs.length) {
    const hashedCard = docs.map(async (card) => {
      const salt = await bcrypt.genSalt(10)
      card.PIN = await bcrypt.hash(card.PIN, salt)
    })
    docs = await Promise.all(hashedCard)
    next()
  } else {
    return next(new Error('Card list should not be empty'))
  }
})

CardListSchema.pre('save', async function (next) {
  if (this.isModified('PIN')) {
    const salt = await bcrypt.genSalt(10)
    this.PIN = await bcrypt.hash(this.PIN, salt)
  }
  next()
})

const CardList = mongoose.model('cardList', CardListSchema)

export default CardList