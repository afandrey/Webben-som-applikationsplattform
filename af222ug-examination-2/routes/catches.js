'use strict'

let router = require('express').Router()
let Catches = require('../models/Catches.js')
let Users = require('../models/Users.js')
let jwt = require('jsonwebtoken')
let WebHooks = require('node-webhooks')

let webHooks = new WebHooks({
  db: './webHooksDB.json'
})

// Get all registered data
router.route('/').get(function (req, res) {
  Catches.find({}, function (err, fish) {
    if (err) {
      return res.status(500).send({ 
        status: '500: Internal Server Error',
        message: 'Something went wrong when trying to get all catches.' 
      })
    }
    let context = {
      status: '200: OK',
      data: fish.map(function (fish) {
        return {
          catch: {
            id: fish._id,
            username: fish.username,
            longitude: fish.longitude,
            latitude: fish.latitude,
            species: fish.species,
            weight: fish.weight,
            length: fish.length,
            imageUrl: fish.imageUrl,
            timestamp: fish.timestamp,
            method: fish.method,
            description: fish.description
          }
        }
      }),
      links: {
        self: [
          {
            href: '/api/catches',
            method: 'GET',
            title: 'Show all catches.'
          }
        ],
        to: [
          {
            href: '/api/catches',
            method: 'POST',
            title: 'Register new catch.'
          },
          {
            href: '/api/catches/' + fish._id,
            method: 'GET',
            title: 'Get data for specific catch.'
          },
          {
            href: '/api/catches/' + fish._id,
            method: 'PUT',
            title: 'Update data for specific catch.',
            description: 'Parameters: username, longitude, latitude, species, weight, length, imageUrl, method, description.'
          },
          {
            href: '/api/catches/' + fish._id,
            method: 'DELETE',
            title: 'Delete data for specific catch.'
          }
        ],
        from: [
          {
            href: '/api',
            method: 'GET',
            title: 'Starting point of API.'
          }
        ]
      }
    }
    return res.status(200).send(context)
  })
})

// Register new data
router.route('/').post(function (req, res) {
  let token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    jwt.verify(token, process.env.TOKEN, function (err, decoded) {
      if (err) {
        return res.status(403).send({
          status: '403: Forbidden', 
          message: 'Token not valid.' 
        })
      } else {
        let newCatch = new Catches({
          username: decoded.username,
          longitude: req.body.longitude,
          latitude: req.body.latitude,
          species: req.body.species,
          weight: req.body.weight,
          length: req.body.length,
          imageUrl: req.body.imageUrl,
          timestamp: req.body.timestamp,
          method: req.body.method,
          description: req.body.description
        })
        newCatch.save().then(function () {
          return res.status(201).send({
            status: '201: Created',
            message: 'New catch created!',
            links: {
              self: [
                {
                  href: '/api/catches',
                  method: 'POST',
                  title: 'Register new catch.'
                }
              ],
              from: [
                {
                  href: '/api/catches',
                  method: 'GET',
                  title: 'Get collection of catches.'
                }
              ]
            }
          })
        })
        webHooks.trigger('catchWebHook', newCatch)
      }
    })
  } else {
    return res.status(403).send({ 
      status: '403: Forbidden',
      message: 'Token not provided.' 
    })
  }
})

// Get individual data for catch
router.route('/:id').get(function (req, res) {
  Catches.findOne({ _id: req.params.id }, function (err, fish) {
    if (err) {
      return res.status(500).send({ 
        status: '500: Internal Server Error',
        message: 'Something went wrong when trying to find catch.' 
      })
    }
    if (fish === null) {
      res.status(404).send({ 
        status: '404: Not Found',
        message: 'Resource not found.' 
      })
    }
    let context = {
      status: '200: OK',
      data: {
        catch: {
          id: fish._id,
          username: fish.username,
          longitude: fish.longitude,
          latitude: fish.latitude,
          species: fish.species,
          weight: fish.weight,
          length: fish.length,
          imageUrl: fish.imageUrl,
          timestamp: fish.timestamp,
          method: fish.method,
          description: fish.description
        },
        links: {
          self: [
            {
              href: '/api/catches/' + fish._id,
              method: 'GET',
              title: 'Get data for specific catch.'
            }
          ],
          from: [
            {
              href: '/api/catches',
              method: 'GET',
              title: 'Get collection of catches.'
            }
          ]
        }
      }
    }
    return res.status(200).send(context)
  })
})

// Update data for a registered catch.
router.route('/:id').put(function (req, res) {
  let token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    jwt.verify(token, process.env.TOKEN, function (err, decoded) {
      if (err) {
        return res.status(403).send({ 
          status: '403: Forbidden',
          message: 'Token not valid.' 
        })
      } else {
        Catches.findOne({ _id: req.params.id }, function (err, fish) {
          Users.findOne({ username: decoded.username }, function (err, user) {
            if (user.username !== fish.username) {
              res.status(403).send({ 
                status: '403: Forbidden',
                message: 'This data does not belong to you.' 
              })
            } else {
              if (err) {
                return res.status(500).send({ 
                  status: '500: Internal Server Error',
                  message: 'Something went wrong when trying to find catch.' 
                })
              }
              if (fish === null) {
                return res.status(404).send({ 
                  status: '404: Not Found',
                  message: 'Resource not found' 
                })
              }

              if (req.body.longitude !== undefined) {
                let long = req.body.longitude
                if (!isNaN(long) && long <= 180 && long >= -180) {
                  fish.longitude = req.body.longitude
                } else {
                  return res.status(400).json({ message: 'Longitude coordinate is not correct.' })
                }
              }
              if (req.body.latitude !== undefined) {
                let lat = req.body.latitude
                if (!isNaN(lat) && lat <= 90 && lat >= -90) {
                  fish.latitude = req.body.latitude
                } else {
                  return res.status(400).json({ message: 'Latitude coordinate is not correct.' })
                }
              }
              if (req.body.species !== undefined) {
                fish.species = req.body.species
              }
              if (req.body.weight !== undefined) {
                if (isNaN(req.body.weight)) {
                  return res.status(400).json({ message: 'Input for weight is not a number.' })
                }
                fish.weight = req.body.weight
              }
              if (req.body.length !== undefined) {
                if (isNaN(req.body.length)) {
                  return res.status(400).json({ message: 'Input for length is not a number.' })
                }
                fish.length = req.body.length
              }
              if (req.body.imageUrl !== undefined) {
                if (req.body.imageUrl.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
                  fish.imageUrl = req.body.imageUrl
                } else {
                  return res.status(400).json({ message: 'imageUrl is not valid.' })
                }
              }
              if (req.body.timestamp !== undefined) {
                fish.timestamp = req.body.timestamp
              }
              if (req.body.method !== undefined) {
                fish.method = req.body.method
              }
              if (req.body.description !== undefined) {
                if (req.body.description.length > 150) {
                  return res.status(400).json({ message: 'Description input is too long, maximum 150 characters.' })
                }
                fish.description = req.body.description
              }

              fish.save().then(function (err) {
                if (err) {
                  return res.status(500).send({
                    status: '500: Internal Server Error',
                    message: 'Something went wrong!'
                  })
                }
              })
              return res.status(202).send({
                status: '202: Accepted',
                message: 'Data is updated',
                links: {
                  self: [
                    {
                      href: '/api/catches/' + req.params.id,
                      method: 'PUT',
                      title: 'Update data for specific catch.'
                    }
                  ],
                  from: [
                    {
                      href: '/api/catches',
                      method: 'GET',
                      title: 'Get collection of catches.'
                    }
                  ]
                }
              })
            }
          })
        })
      }
    })
  } else {
    return res.status(403).send({ 
      status: '403: Forbidden',
      message: 'Token not provided' 
    })
  }
})

// Delete registered catch.
router.route('/:id').delete(function (req, res) {
  let token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    jwt.verify(token, process.env.TOKEN, function (err, decoded) {
      if (err) {
        return res.status(403).send({ 
          status: '403: Forbidden',
          message: 'Token not valid.' 
        })
      } else {
        Catches.findOneAndRemove({ _id: req.params.id }, function (err, fish) {
          if (err) {
            return res.status(500).send({
              status: '500: Internal Server Error',
              message: 'Something went wrong!'
            })
          }
          if (fish === null) {
            return res.status(404).send({ 
              status: '404: Not Found',
              message: 'Resource not found' 
            })
          }
          return res.status(202).send({
            status: '202: Accepted',
            message: 'Catch was successfully deleted!',
            links: {
              self: [
                {
                  href: '/api/catches/' + req.params.id,
                  method: 'DELETE',
                  title: 'Delete data for specific catch.'
                }
              ],
              from: [
                {
                  href: '/api/catches',
                  method: 'GET',
                  title: 'Get collection of catches.'
                }
              ]
            }
          })
        })
      }
    })
  } else {
    return res.status(403).send({ 
      status: '403: Forbidden',
      message: 'Token not provided.' 
    })
  }
})

module.exports = router
