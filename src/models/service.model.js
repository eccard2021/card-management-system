import mongoose from 'mongoose'
import { convertCurrency, roundNumber } from '../utilities/currency'

const ServiceSchema = mongoose.Schema({
  service_name: {
    type: String,
    unique: true,
    required: true
  },
  fixedfee: {
    type: Number,
    required: true,
    min: 0
  },
  fee_rate: {
    type: Number,
    min: 0,
    max: 1
  },
  coefficient: {
    type: Number,
    required: true,
    min: -1,
    max: 1,
    default: 1
  },
  action: {
    type: String,
    required: true,
    enum: ['charge', 'withdraw', 'transfer', 'payment', 'monthly_fee', 'service_fee']
  }
})

ServiceSchema.methods.calculateServiceFee = async function (transactionLog) {
  //transactionLog.transactionFee = this.fixedfee + Math.abs(transactionLog.transactionAmount) * this.fee_rate
  if (transactionLog.toCurrency.currency_code === 'VND') {
    transactionLog.toCurrency.transactionFee = roundNumber((this.fixedfee + Math.abs(transactionLog.toCurrency.transactionAmount) * this.fee_rate), 2)
    transactionLog.fromCurrency.transactionFee = await convertCurrency(
      transactionLog.toCurrency.currency_code,
      transactionLog.fromCurrency.currency_code,
      transactionLog.toCurrency.transactionFee
    )
  } else {
    transactionLog.fromCurrency.transactionFee = roundNumber((this.fixedfee + Math.abs(transactionLog.fromCurrency.transactionAmount) * this.fee_rate), 2)
    transactionLog.toCurrency.transactionFee = await convertCurrency(
      transactionLog.fromCurrency.currency_code,
      transactionLog.toCurrency.currency_code,
      transactionLog.fromCurrency.transactionFee
    )
  }
}

const Service = mongoose.model('Services', ServiceSchema)

export default Service