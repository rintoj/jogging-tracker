const express = require('express')
const mongoose = require('mongoose')
const resolvable = require('resolvable')

const router = express.Router()

const {
  handleError,
  send
} = require('../util')

function maskUser(user) {
  if (user == null) return user
  return {
    id: user.userId,
    name: user.name,
    picture: user.picture,
    roles: user.roles
  }
}

function findUser(User, userId) {
  return resolvable(User.findOne.bind(User))({
    userId
  })
}

router.get('/profile', function(request, response) {

  const User = mongoose.models.User
  if (User == null) return send('User service is not properly configured!', 500)
  if (request.user == null) return send('Unauthorized', 401)

  return Promise.resolve(request.user.userId || request.params.userId)
    .then(userId => findUser(User, userId))
    .then(user => maskUser(user))
    .then(user => send(response, user))
    .catch(error => handleError(error, response))
})

module.exports = router