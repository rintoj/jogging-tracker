// import
var mongoRestifier = require('mongo-restifier');
var isDev = process.env.NODE_ENV === 'development'

// configure the api
mongoRestifier(isDev ? 'server/conf/api-dev.conf.json' : 'server/conf/api.conf.json')
  .registerModel(require('./model/todo'))
  .startup();