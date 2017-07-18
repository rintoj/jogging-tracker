const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

module.exports = function auth0Service(config) {
  return jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the singing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret(config.jwtSecret),

    // Validate the audience and the issuer.
    issuer: config.authService.issuer,
    algorithms: config.authService.algorithms
  })
}