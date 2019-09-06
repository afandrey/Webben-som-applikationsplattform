'use strict'

let mongoose = require('mongoose')
let bcrypt = require('bcrypt-nodejs')

let userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 20 },
  password: { type: String, require: true, minlength: 8 }
})

userSchema.pre('save', function (next) {
  let user = this

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err)
    }

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err)
      }
      user.password = hash

      next()
    })
  })
})

userSchema.methods.comparePassword = function (pass, callback) {
  bcrypt.compare(pass, this.password, function (err, res) {
    if (err) {
      return callback(err)
    }
    callback(null, res)
  })
}

let Users = mongoose.model('User', userSchema)

module.exports = Users
