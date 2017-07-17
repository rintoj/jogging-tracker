function generateId() {
  return Math.random().toString().substr(-6)
}

module.exports = {
  staticFileGlobs: [
    'dist/**.html',
    'dist/**.js',
    'dist/**.css',
    'dist/**.ttf',
    'dist/**.woff2',
    'dist/**.woff',
    'dist/**.eot',
    'dist/**.svg',
    'dist/**.json',
    'dist/assets/img/*',
    'dist/assets/icon/*'
  ],
  cacheId: generateId(),
  runtimeCaching: [{
    urlPattern: /jog\-tracker\-tt\.herokuapp\.com\/api/,
    handler: 'networkFirst'
  }, {
    urlPattern: /index.html$/,
    handler: 'networkFirst'
  }],
  root: 'dist',
  stripPrefix: 'dist/',
  navigateFallback: '/index.html'
};