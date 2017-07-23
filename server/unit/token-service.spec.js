const chai = require('./chai')
const baseUrl = 'http://localhost:5000'
const url = '/api/oauth2/token'

describe('/api/oauth2/token', () => {

  it('should be accessible', async() => {
    const res = await chai.request(baseUrl).options(url)
    res.should.have.status(200)
    res.text.should.equal('POST')
  })

  it('should issue a token if correct credentials are passed', async() => {
    const res = await chai.request(baseUrl).post(url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Basic ${chai.BASE_AUTH_TOKEN}`)
      .send({
        'grant_type': 'password',
        'username': 'admin@system.com',
        'password': 'admin'
      })
    res.should.have.status(200)
    res.body.should.be.a('object')
    res.should.be.a('object')
    res.body.should.have.property('token_type')
    res.body.token_type.should.be.equal('bearer')
    res.body.should.have.property('access_token')
    res.body.should.have.property('expires_in')
    res.body.should.have.property('refresh_token')
  })

  it('should NOT issue a token if authorization header is not passed', async() => {
    chai.request(baseUrl).post(url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        'grant_type': 'password',
        'username': 'admin@system.com',
        'password': 'admin'
      }).end((err, res) => res.should.have.status(401))
  })

  it('should NOT issue a token if incorrect credentials are passed', async() => {
    chai.request(baseUrl).post(url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Basic ${chai.BASE_AUTH_TOKEN}`)
      .send({
        'grant_type': 'password',
        'username': 'admin@system.com',
        'password': 'admin1'
      })
      .end((err, res) => {
        res.should.have.status(503)
      })
  })
})