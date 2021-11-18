import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'
import env from '../config/environment'

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
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = Jwt.sign({ _id: user._id }, env.JWT_SECRET)
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

UserSchema.statics.findByCredentials = async (email, password, select) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Email hoặc password không hợp lệ')
  }
  const isPasswordMatch = await user.matchPassword(password)
  if (!isPasswordMatch) {
    throw new Error('Email hoặc password không hợp lệ')
  }
  return user
}

const User = mongoose.model('Users', UserSchema)

export default User