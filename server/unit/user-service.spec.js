const baseUrl = 'http://localhost:5000'
const chai = require('./chai')(baseUrl)

describe('/api/oauth2/user', () => {

  const url = '/api/oauth2/user'

  before((done) => {
    chai.login(done)
  })

  it('should be accessible', (done) => {
    chai.request(baseUrl).options('/api/oauth2/token').end((err, res) => {
      res.should.have.status(200)
      res.text.should.equal('POST')
      done()
    })
  })

  it('should be accessible', (done) => {
    chai.request(baseUrl).options(url).end((err, res) => {
      res.should.have.status(200)
      res.text.should.equal('PUT,GET,HEAD,POST,DELETE')
      done()
    })
  })

  it('should deny GET without access token', (done) => {
    chai.request(baseUrl).get(url).end((err, res) => {
      res.should.have.status(401)
      done()
    })
  })

  it('should deny POST without access token', (done) => {
    chai.request(baseUrl).post(url).end((err, res) => {
      res.should.have.status(401)
      done()
    })
  })

  it('should deny PUT without access token', (done) => {
    chai.request(baseUrl).put(url).end((err, res) => {
      res.should.have.status(401)
      done()
    })
  })

  it('should deny DELETE without access token', (done) => {
    chai.request(baseUrl).delete(url).end((err, res) => {
      res.should.have.status(401)
      done()
    })
  })

  it('should return list of users with access token', (done) => {
    chai.request(baseUrl).get(url)
      .set('Authorization', chai.ACCESS_TOKEN)
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

})