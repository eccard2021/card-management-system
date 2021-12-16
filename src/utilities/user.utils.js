const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export const generateAccountNumber = (accNumber) => {
  return '154704070015' + '0'.repeat(3 - accNumber.toString().length) + accNumber.toString()
}

export const generateRandomPassword = (passlength) => {
  let password = ''
  const charactersLength = characters.length
  for (let i = 0; i < passlength; i++) {
    password += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return password
}