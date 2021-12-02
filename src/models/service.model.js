import mongoose from 'mongoose'

const ServiceSchema = mongoose.Schema({
  service_name: {
    type: String,
    unique: true,
    require: true
  },
  fixedfee: {
    type: Number,
    require: true,
    min: 0
  },
  fee_rate: {
    type: Number,
    min: 0,
    max: 1
  },
  coefficient: {
    type: Number,
    require: true,
    min: -1,
    max: 1,
    default: 1
  },
  action: {
    type: String,
    require: true,
    enum: ['charge', 'withdraw', 'transfer', 'payment', 'monthly_fee', 'service_fee']
  }
})

ServiceSchema.methods.calculateServiceFee = async function (transactionLog) {
  transactionLog.transactionFee = this.fixedfee + Math.abs(transactionLog.transactionAmount) * this.fee_rate
}

const Service = mongoose.model('Services', ServiceSchema)

export default Service