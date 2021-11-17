export const standardizeCardNameForUrl = (cardName) => {
  return cardName.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/ /g, '-')
    .toLowerCase()
}