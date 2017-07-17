// import
var mongoRestifier = require('mongo-restifier');
var isDev = process.env.NODE_ENV === 'development'

// configure the api
mongoRestifier(isDev ? 'conf/app-conf.dev.json' : 'conf/app-conf.json', (properties) => {
    properties.api.port = process.env.PORT || 5000
    return properties
  })
  .registerModel(require('./model/todo'))
  .startup((app) => {
    app.use(require('serve-static')(__dirname + '/../../ui/dist'));
  });