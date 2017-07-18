const express = require('express')
const mongoose = require('mongoose')
const resolvable = require('resolvable')

const router = express.Router()

router.post('/register', (request, response) => {

  const User = mongoose.models.User

  if (User == undefined) {
    return send('User service is not properly configured!', 500)
  }

  const userInfo = {
    userId: request.user.email,
    name: (request.user.name || '').replace(/\@.*$/, ''),
    nickname: request.user.nickname,
    picture: request.user.picture,
    active: true,
    roles: ['user']
  }

  if (request.body.password != undefined) {
    userInfo.password = request.body.password
  }

  Promise.resolve(userInfo)
    .then(user => findUser(User, user.userId))
    .then(user => createRecord(user, userInfo, User))
    .then(user => saveUser(user))
    .then(user => send(response, user))
    .catch(error => handleError(error, response))
})

function createRecord(user, userInfo, User) {
  return user ? Object.assign(user, {
    new: false
  }, userInfo) : new User(Object.assign({
    new: true
  }, userInfo))
}

function handleError(error, response) {
  console.log(error)
  send(response, error, 500)
}

function findUser(User, userId) {
  return resolvable(User.findOne.bind(User))(userId)
}

function saveUser(user) {
  return resolvable(user.save)()
}

function send(response, data, status) {
  response.status(status || 200)
  response.json(status ? {
    status,
    error: data
  } : data)
}

module.exports = router