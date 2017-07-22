const express = require('express')
const mongoose = require('mongoose')
const resolvable = require('resolvable')

const router = express.Router()

const {
  handleError,
  send
} = require('../util')

let JogLog, findAll, started

function startup() {
  JogLog = mongoose.models.JogLog
  findAll = resolvable(JogLog.find.bind(JogLog))
  started = true
}

function getStatistics(user) {
  if (!started) startup()
  return Promise.resolve(user)
    .then(user => findAll({
      $query: {
        user
      },
      $orderby: {
        date: 1
      }
    }))
}

router.get('/statistics', function(request, response) {

  const userId = request.user.userId

  getStatistics(userId).then(data => {
    console.log(data)
    send(response, data, 500)
  })

})

module.exports = router