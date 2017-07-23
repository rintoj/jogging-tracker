const chai = require('./chai')

const baseUrl = 'http://localhost:5000'
const url = '/api/oauth2/revoke'

xdescribe('/api/oauth2/revoke', () => {

  before(async() => chai.setup(baseUrl))

  it('should be accessible', async() => {
    const res = await chai.request(baseUrl).options(url)
    res.should.have.status(200)
    res.text.should.equal('POST')
  })

  it('should not revoke a token if incorrect credentials are passed', async() => {
    chai.request(baseUrl).post(url).end((err, res) => {
      res.should.have.status(400)
    })
  })

  it('should revoke an issued token if correct credentials are passed', async() => {
    const res = await chai.request(baseUrl).post(url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', chai.ACCESS_TOKEN)
    res.should.have.status(200)
  })
})