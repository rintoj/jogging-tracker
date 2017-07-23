const chai = require('chai')

chai.should()
chai.use(require('chai-http'))
chai.use(require('chai-sorted'))
chai.use(require('chai-things'))

const BASE_AUTH_TOKEN = 'N2Q2NWQ5YjYtNWNhZS00ZGI3LWIxOWQtNTZjYmRkMjVlYWFiOmEwYzdiNzQxLWIxOGItNDdlYi1iNmRmLTQ4YTBiZDNjZGUyZQ=='

chai.login = function login(done, userId, password) {
  chai.request(chai.baseUrl)
    .post('/api/oauth2/token')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', `Basic ${BASE_AUTH_TOKEN}`)
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

module.exports = (baseUrl) => {
  chai.baseUrl = baseUrl
  return chai
}