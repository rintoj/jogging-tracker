var fallback = require('express-history-api-fallback')
var mongoRestifier = require('mongo-restifier');
var isDev = process.env.NODE_ENV === 'development'

// configure the api
mongoRestifier(isDev ? 'conf/app-conf.dev.json' : 'conf/app-conf.json', (properties) => {
    properties.api.port = process.env.PORT || 5000
    return properties
  })
  .registerModel(require('./model/todo'))
  .startup((app) => {
    const root = __dirname + '/../../ui/dist'
    app.use(require('serve-static')(root));
    app.use(fallback('index.html', {
      root
    }))
  });