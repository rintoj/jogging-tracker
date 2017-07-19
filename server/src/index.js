const fallback = require('express-history-api-fallback')
const mongoRestifier = require('../mongo-restifier')
const profileService = require('./service/profile-service')

const isDev = process.env.NODE_ENV === 'development'
const configPath = isDev ? 'conf/app-conf.dev.json' : 'conf/app-conf.json'
const config = require('../../' + configPath)

const auth0Check = require('./service/auth0-service')(config)

// configure the api
mongoRestifier(configPath, (properties) => {
    properties.api.port = process.env.PORT || 5000
    return properties
  })

  // register models
  .registerModel(require('./model/todo'))

  // startup the app
  .startup((app) => {

    // get profile service
    app.use('/api', profileService.fetchProfileRouter)

    // save profile service used for register and password reset
    app.use('/api', auth0Check, profileService.saveProfileRouter)

  });