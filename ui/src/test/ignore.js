const requireHacker = require('require-hacker')
requireHacker.hook('png', () => 'module.exports = ""')
requireHacker.hook('jpg', () => 'module.exports = ""')
requireHacker.hook('css', () => 'module.exports = ""')