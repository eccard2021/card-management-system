import axios from 'axios'

const getCurrencyData = async () => {
  var currency = {}
  await axios.get('https://api.exchangerate-api.com/v4/latest/USD')
    .then(res => currency = res.data)
  return currency
}

export const getRate = async (from, to) => {
  var currency = await getCurrencyData()
  let fromRate = currency.rates[from]
  let toRate = currency.rates[to]
  if (!fromRate || !toRate)
    throw new Error('Not found from coin or to coin')
  return toRate / fromRate
}

export const convertCurrency = async (from, to, value) => {
  var currency = await getCurrencyData()
  let fromRate = currency.rates[from]
  let toRate = currency.rates[to]
  if (!fromRate || !toRate)
    throw new Error('Not found from coin or to coin')
  const t = Number((toRate / fromRate) * value)
  return Math.round(t * 100) / 100
}

export const roundNumber = (value, decimal) => {
  let t = Math.pow(10, decimal)
  return Math.round(value * t) / t
}