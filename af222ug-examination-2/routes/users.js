'use strict'

let router = require('express').Router()
let Users = require('../models/Users.js')
let jwt = require('jsonwebtoken')

// Get all users
router.route('/').get(function (req, res) {
  Users.find({}, function (err, data) {
    if (err) {
      return res.status(500).send({ 
        status: '500: Internal Server Error',
        message: 'Something went wrong when trying to get all users.' 
      })
    }
    let context = {
      status: '200: OK',
      users: data.map(function (user) {
        return {
          username: user.username
        }
      }),
      links: {
        self: [
          {
            href: '/api/users',
            method: 'GET',
            title: 'Show all users.'
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

// Create new user
router.route('/').post(function (req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({ 
      status: '400: Bad Request',
      message: 'You need to fill in username and password.' 
    })
  } else if (req.body.username > 21) {
    res.status(400).send({ 
      status: '400: Bad Request',
      message: 'Username can not be more than 20 characters' 
    })
  } else if (req.body.password < 8) {
    res.status(400).send({ 
      status: '400: Bad Request',
      message: 'Password must be at least 8 characters.' 
    })
  } else {
    let newUser = new Users({
      username: req.body.username,
      password: req.body.password
    })
    newUser.save().then(function () {
      return res.status(201).send({
        status: '201: Created',
        message: 'Registered successfully.',
        links: {
          self: [
            {
              href: '/api/users',
              method: 'POST',
              title: 'Register a user'
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
      })
    }).catch(function (err) {
      return res.status(500).send({
        status: '500: Internal Server Error',
        message: 'User already exists.'
      })
    })
  }
})

router.route('/auth').post(function (req, res) {
  Users.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      res.status(500).send({ 
        status: '500: Internal Server Error',
        message: 'Something went wrong when trying to find a user.' 
      })
    }
    if (!user) {
      res.status(403).send({ 
        status: '403: Forbidden',
        message: 'User not found.' 
      })
    } else {
      user.comparePassword(req.body.password, function (err, pass) {
        if (err) {
          res.status(500).send({ 
            status: '500: Internal Server Error',
            message: 'Something went wrong when validating.' 
          })
        } else {
          if (!pass) {
            res.status(403).send({ 
              status: '403: Forbidden',
              message: 'Password not valid.' 
            })
          } else {
            let token = jwt.sign({ username: user.username }, process.env.TOKEN, {
              expiresIn: '1h'
            })
            return res.status(202).send({
              status: '202: Accepted',
              message: 'Welcome!',
              token: token,
              links: {
                self: [
                  {
                    href: '/api/users/auth',
                    method: 'POST',
                    title: 'Login a user.'
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
            })
          }
        }
      })
    }
  })
})

module.exports = router
