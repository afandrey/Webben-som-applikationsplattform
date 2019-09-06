'use strict'

let mongoose = require('mongoose')

module.exports = function () {
  let uri = 'mongodb://admin:12345@ds211289.mlab.com:11289/webapi'

  mongoose.connect(uri)

  let db = mongoose.connection

  db.on('connected', function () {
    console.log('Mongoose connection open.')
  })

  db.on('error', function (err) {
    console.log('Mongoose connection error: ', err)
  })

  db.on('disconnected', function () {
    console.log('Mongoose connection disconnected.')
  })

  process.on('SIGINT', function () {
    db.close(function () {
      console.log('Mongoose conection disconnected through app termination.')
      process.exit(0)
    })
  })

  return db
}
