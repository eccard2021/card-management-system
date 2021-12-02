import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'
import env from '../config/environment'
import TransactionLog from './transactionModel'
import Service from './service.model'
import Token from './token.model'

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
    required: true
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
    required: true
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
    default: 0
  },
  balanceFluctuations: [{
    transactionLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transactionlogs',
      required: true
    },
    amount: {
      type: Number,
      require: true
    },
    endingBalance: {
      type: Number,
      require: true
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

UserSchema.methods.updateBalance = async function (serviceName, transactionLog) {
  const user = this
  try {
    const service = await Service.findOne({ service_name: serviceName }).exec()
    transactionLog.transType = service._id
    await service.calculateServiceFee(transactionLog)
    const log = await TransactionLog.create(transactionLog)
    log.save()
    user.balance = (user.balance + service.coefficient * transactionLog.transactionAmount - transactionLog.transactionFee).toFixed(2)
    user.balanceFluctuations.push({
      transactionLog: log._id,
      amount: log.transactionAmount,
      endingBalance: this.balance,
      description: log.description
    })
    await user.save()
  }
  catch (error) {
    console.log(error)
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
  if (!user || await user.matchPassword(password)) {
    throw new Error('Email hoặc password không hợp lệ')
  }
  return user
}

UserSchema.statics.isExist = async function (email) {
  return await User.findOne({ email }) != null
}

//--------------------------------------HOOKS--------------------------------------------

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

const User = mongoose.model('Users', UserSchema)

export default User