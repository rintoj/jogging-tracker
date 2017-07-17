const isDev = process.env.NODE_ENV === 'development'

export const config = require(`../../../conf/app-conf${isDev ? '.dev' : ''}.json`)