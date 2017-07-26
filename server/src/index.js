const dedupService = require('./service/dedup-service')
const mongoRestifier = require('mongo-restifier')
const profileService = require('./service/profile-service')
const statisticsService = require('./service/statistics-service')

const isDev = process.env.NODE_ENV === 'development'
const configPath = isDev ? 'conf/app-conf.dev.json' : 'conf/app-conf.prod.json'

function configure(properties) {
  properties.api.port = process.env.PORT || 5000
  return properties
}

// configure the api
const restifier = mongoRestifier(configPath, configure)

  // register models
  .registerModel(require('./model/jog-log'))

  // startup the app
  .startup((app) => {

    // custom services
    app.use('/api', profileService)
    app.use('/api', statisticsService)
    app.use('/api', dedupService)

  })

module.exports = restifier