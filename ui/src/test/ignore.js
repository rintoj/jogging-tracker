const requireHacker = require('require-hacker')
requireHacker.hook('png', () => 'module.exports = ""')