const express = require('express')
const mongoose = require('mongoose')
const resolvable = require('resolvable')

const fetchProfileRouter = express.Router()
const saveProfileRouter = express.Router()

fetchProfileRouter.get('/profile', (request, response) => {

  const User = mongoose.models.User

  if (User == undefined) {
    return send('User service is not properly configured!', 500)
  }

  if (request.user == undefined) {
    return send('Unauthorized', 401)
  }

  Promise.resolve(request.user.userId)
    .then(userId => findUser(User, userId))
    .then(user => maskUser(user))
    .then(user => send(response, user))
    .catch(error => handleError(error, response))
})

saveProfileRouter.put('/profile', (request, response) => {

  const User = mongoose.models.User

  if (User == undefined) {
    return send('User service is not properly configured!', 500)
  }

  const userInfo = {
    userId: request.body.id,
    name: request.body.name,
    picture: request.body.picture,
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

function maskUser(user) {
  return {
    id: user.userId,
    name: user.name,
    picture: user.picture,
    roles: user.roles
  }
}

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
  return resolvable(User.findOne.bind(User))({
    userId
  })
}

function saveUser(user) {
  return resolvable(user.save)()
    .then(user => {
      return user.new ? {
        created: true,
        id: user.userId
      } : {
        updated: true,
        id: user.userId
      }
    })
}

function send(response, data, status) {
  response.status(status || 200)
  response.json(status ? {
    status,
    error: data
  } : data)
}

module.exports = {
  fetchProfileRouter,
  saveProfileRouter
}