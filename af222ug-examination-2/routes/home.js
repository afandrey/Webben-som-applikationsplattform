/**
 * Routing to get links
*/

'use strict'

let router = require('express').Router()

router.route('/').get(function (req, res) {
  res.status(200).send({
    status: '200: OK',
    links: {
      self: [
        { 
          href: '/api', 
          method: 'GET', 
          title: 'Starting point of API.' 
        }
      ],
      to: [
        { 
          href: '/api/catches', 
          method: 'GET', 
          title: 'Get collection of catches.' 
        },
        {
          href: '/api/catches',
          method: 'POST',
          title: 'Register new catch.',
          description: 'Parameters: username, longitude, latitude, species, weight, length, imageUrl, timestamp, method, description.'
        },
        {
          href: '/api/users',
          method: 'POST',
          title: 'Register a user',
          description: 'Parameters: username, password.'
        },
        {
          href: '/api/users',
          method: 'GET',
          title: 'Show all users.'
        },
        {
          href: '/api/users/auth',
          method: 'POST',
          title: 'Login a user',
          description: 'Parameters: username, password.'
        },
        {
          href: '/api/webhooks',
          method: 'GET',
          title: 'Webhook information.'
        }
      ]
    }
  })
})

module.exports = router
