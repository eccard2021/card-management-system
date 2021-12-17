export const standardizeCardNameForUrl = (cardName) => {
  return cardName.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/ /g, '-')
    .toLowerCase()
}

const characters = '0123456789'
export const randomPIN = function () {
  let PIN = ''
  for (let i = 0; i < 6; i++) {
    PIN += characters.charAt(Math.floor(Math.random() * 10))
  }
  return PIN
}