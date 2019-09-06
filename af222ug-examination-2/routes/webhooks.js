'use strict'

let router = require('express').Router()
let fs = require('fs')
let WebHooks = require('node-webhooks')

let webHooks = new WebHooks({
  db: './webHooksDB.json'
})

router.route('/').get(function (req, res) {
  res.status(200).send({
    links: {
      self: [
        {
          href: '/api/webhooks',
          method: 'GET',
          title: 'Webhook information.'
        }
      ],
      to: [
        {
          href: '/api/webhooks',
          method: 'POST',
          title: 'Add webhook'
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
})

router.route('/').post(function (req, res) {
  webHooks.add('catchWebHook', req.body.url).then(function () {
    res.status(201).send({
      status: '201: Created',
      message: 'Webhook registered successfully!',
      links: {
        self: [
          {
            href: '/api/webhooks',
            method: 'POST',
            title: 'Add webhook.'
          }
        ],
        from: [
          {
            href: '/api/webhooks',
            method: 'GET',
            title: 'Webhook information.'
          }
        ]
      }
    })
  }).catch(function (err) {
    return res.status(500).send({
      status: '500: Internal Server Error',
      message: 'Something went wrong!'
    })
  })
})

module.exports = router
