const mongoose = require('mongoose')
const Todo = require('./models/Todo')
const { MONGO_URL } = require('../util/config')

if (MONGO_URL && !mongoose.connection.readyState) {
  mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB Connected.'))
  .catch((e) => {
    console.log('e', e)
    console.log('MONGO_URL', MONGO_URL)
    console.log('DB Connection Failed!')
  })
}


module.exports = {
  Todo
}
