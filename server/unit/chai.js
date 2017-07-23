const chai = require('chai')
const http = require('chai-http')
chai.should()
chai.use(http)
chai.use(require('chai-sorted'))
chai.use(require('chai-things'))

chai.BASE_AUTH_TOKEN = 'N2Q2NWQ5YjYtNWNhZS00ZGI3LWIxOWQtNTZjYmRkMjVlYWFiOmEwYzdiNzQxLWIxOGItNDdlYi1iNmRmLTQ4YTBiZDNjZGUyZQ=='

chai.login = function login(baseUrl, done, userId, password) {
  chai.request(baseUrl)
    .post('/api/oauth2/token')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', `Basic ${chai.BASE_AUTH_TOKEN}`)
    .send({
      'grant_type': 'password',
      'username': userId || 'admin@system.com',
      'password': password || 'admin'
    })
    .end(function(err, res) {
      if (err) throw new Error('Login failed')
      res.should.have.status(200)
      chai.ACCESS_TOKEN = `Bearer ${res.body.access_token}`
      done()
    })
}

module.exports = chai