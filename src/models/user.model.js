import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'
import env from '../config/environment'
import Token from './token.model'
import { roundNumber } from '../utilities/currency'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const UserSchema = mongoose.Schema({
  //noi dung KH nhap
  name: {
    type: String,
    required: [true, 'name required']
  },
  birth: {
    type: Date,
    required: true
  },
  isMale: {
    type: Boolean,
    required: true,
    default: false
  },
  personalIdNumber: {
    number: { type: String, required: true, unique: true },
    issueDate: { type: Date, required: true },
    issuePlace: { type: String, required: true }
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  homeAddress: {
    type: String,
    required: true
  },
  job: {
    title: { type: String, required: true },
    workAddress: { type: String, required: true },
    salary: { type: Number, required: true }
  },
  // tu phan nay tro di la he thong tu sinh ra, roi gui ve KH qua email
  accNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: { //khong gui cai nay
    type: Boolean,
    required: true,
    default: false
  },
  isActive: { //khong gui cai nay
    type: Boolean,
    required: true,
    default: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  balanceFluctuations: [{
    transactionLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transactionlogs',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    endingBalance: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    createAt: {
      type: Date,
      default: Date.now()
    }
  }]
}, {
  timestamps: true
})

//--------------------------------------METHODS--------------------------------------------

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.updateBalance = async function (transactionLog, service, opts) {
  const user = this
  try {
    let tmp = ''
    if (transactionLog.toCurrency.currency_code === 'VND')
      tmp = 'toCurrency'
    else
      tmp = 'fromCurrency'
    user.balance = roundNumber(user.balance + service.coefficient * transactionLog[tmp].transactionAmount - transactionLog[tmp].transactionFee, 2)
    user.balanceFluctuations.push({
      transactionLog: transactionLog._id,
      amount: transactionLog[tmp].transactionAmount,
      endingBalance: this.balance,
      description: transactionLog.description
    })
    await user.save(opts)
  }
  catch (error) {
    console.log(error)
    throw error
  }
}

UserSchema.methods.receiveMoney = async function (transactionLog, opts) {
  const user = this
  try {
    user.balance = roundNumber(user.balance + transactionLog.toCurrency.transactionAmount, 2)
    user.balanceFluctuations.push({
      transactionLog: transactionLog._id,
      amount: transactionLog.toCurrency.transactionAmount,
      endingBalance: this.balance,
      description: transactionLog.description
    })
    await user.save(opts)
  }
  catch (error) {
    console.log(error)
    throw error
  }
}

UserSchema.methods.payment = async function (paymentLogCustomer, card, opts) {
  try {
    this.balance = roundNumber(this.balance - paymentLogCustomer.fromCurrency.transactionAmount - paymentLogCustomer.fromCurrency.transactionFee, 2)
    card.currentUsed += roundNumber(paymentLogCustomer.fromCurrency.transactionAmount + paymentLogCustomer.fromCurrency.transactionFee, 2)
    this.balanceFluctuations.push({
      transactionLog: paymentLogCustomer._id,
      amount: paymentLogCustomer.toCurrency.transactionAmount,
      endingBalance: this.balance,
      description: paymentLogCustomer.description
    })
    await this.save(opts)
    await card.save(opts)
  } catch (error) {
    console.log(error)
    throw error
  }
}

UserSchema.methods.paymentCredit = async function (paymentLogCustomer, opts) {
  try {
    this.balanceFluctuations.push({
      transactionLog: paymentLogCustomer._id,
      amount: paymentLogCustomer.toCurrency.transactionAmount,
      endingBalance: this.balance,
      description: paymentLogCustomer.description
    })
    await this.save(opts)
  } catch (error) {
    console.log(error)
    throw error
  }
}

UserSchema.methods.merchantUpdate = async function (paymentLogCustomer, paymentLogMerchant, opts) {
  try {
    this.balance = roundNumber(this.balance + paymentLogCustomer.fromCurrency.transactionAmount - paymentLogMerchant.fromCurrency.transactionAmount, 2)
    this.balanceFluctuations.push({
      transactionLog: paymentLogMerchant._id,
      amount: paymentLogMerchant.toCurrency.transactionAmount,
      endingBalance: this.balance,
      description: paymentLogMerchant.description
    })
    await this.save(opts)
  } catch (error) {
    console.log(error)
    throw error
  }
}

UserSchema.methods.accountMaintenanceFee = async function (transactionLog, opts) {
  const user = this
  try {
    if (user.balance < transactionLog.fromCurrency.transactionAmount) {
      user.balance = 0
      transactionLog.fromCurrency.transactionAmount = 0
      transactionLog.toCurrency.transactionAmount = 0
    }
    else {
      user.balance = roundNumber(user.balance - transactionLog.fromCurrency.transactionAmount, 2)
    }
    user.balanceFluctuations.push({
      transactionLog: transactionLog._id,
      amount: transactionLog.fromCurrency.transactionAmount,
      endingBalance: this.balance,
      description: transactionLog.description
    })
    await user.save(opts)
  }
  catch (error) {
    console.log(error)
    throw error
  }
}

UserSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = Jwt.sign({ _id: user._id }, env.JWT_SECRET)
  let tokenSave = await Token.create({
    userId: user._id,
    tokenType: 'login',
    token: token
  })
  await tokenSave.save()
  return token
}

UserSchema.methods.logOut = async function (token) {
  await Token.deleteOne({ userId: mongoose.Types.ObjectId(this._id), token: token.token, tokenType: 'login' })
}

UserSchema.methods.logOutAll = async function () {
  await Token.deleteMany({ userId: mongoose.Types.ObjectId(this._id), tokenType: 'login' })
}
//--------------------------------------STATICS--------------------------------------------

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Email hoặc password không hợp lệ')
  }
  return user
}

UserSchema.statics.findByEmail = async (email) => {
  const user = await User.findOne({ email })
  return user
}

UserSchema.statics.isExist = async function (email) {
  return await User.findOne({ email }) != null
}

//--------------------------------------HOOKS--------------------------------------------

UserSchema.pre('insertMany', async function (next, docs) {
  if (Array.isArray(docs) && docs.length) {
    const hashedUser = docs.map(async (user) => {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)
    })
    docs = await Promise.all(hashedUser)
    next()
  } else {
    return next(new Error('User list should not be empty'))
  }
})

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

UserSchema.plugin(aggregatePaginate)

const User = mongoose.model('Users', UserSchema)

export default User