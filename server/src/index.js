var fallback = require('express-history-api-fallback')
var auth0Service = require('./service/auth0-service')
var mongoRestifier = require('mongo-restifier')

var isDev = process.env.NODE_ENV === 'development'
var configPath = isDev ? 'conf/app-conf.dev.json' : 'conf/app-conf.json'
var config = require('../../' + configPath)

// configure the api
mongoRestifier(configPath, (properties) => {
    properties.api.port = process.env.PORT || 5000
    return properties
  })
  .registerModel(require('./model/todo'))
  .startup((app) => {

    const auth0Check = auth0Service(config)
    app.use('/api', auth0Check, require('./service/user-service'))

    // serve static
    const root = __dirname + '/../../ui/dist'
    app.use(require('serve-static')(root));
    app.use(fallback('index.html', {
      root
    }))
  });