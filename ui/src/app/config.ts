
export function getConfig(isDev) {
  return require(`../../../conf/app-conf${isDev ? '.dev' : '.prod'}.json`)
}

export const config = getConfig(process.env.NODE_ENV === 'development')