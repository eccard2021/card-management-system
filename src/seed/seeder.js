require('dotenv').config()
import { users } from './data.js'
import User from '../models/user.model'
import { connectDB } from '../config/db'

connectDB()
  .then(() => console.log('Connected succesfully to database server!'))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

const importData = async () => {
  try {
    await User.deleteMany()
    await User.insertMany(users)
    console.log('Data Imported !')
    process.exit()

  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}


const destroyData = async () => {
  try {
    await User.deleteMany()
    console.log('Data destroyed !')
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
}
else { importData() }