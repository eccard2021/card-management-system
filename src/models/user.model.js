import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

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
  }
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

const User = mongoose.model('Users', UserSchema)

export default User