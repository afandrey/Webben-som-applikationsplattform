'use strict'

let mongoose = require('mongoose')

let catchSchema = mongoose.Schema({
  username: { type: String, required: true, maxlength: 20 },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  species: { type: String, required: true },
  weight: { type: Number, required: true },
  length: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  timestamp: { type: Date, reqired: true, default: Date.now },
  method: { type: String, required: true },
  description: { type: String, required: true, maxlength: 150 }
})

let Catches = mongoose.model('catchSchema', catchSchema)

module.exports = Catches
