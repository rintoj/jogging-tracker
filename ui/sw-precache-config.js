function generateId() {
  return Math.random().toString().substr(-6)
}

module.exports = {
  staticFileGlobs: [
    'dist/*.html',
    'dist/*.js',
    'dist/**.json',
    'dist/assets/fonts/**/*',
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