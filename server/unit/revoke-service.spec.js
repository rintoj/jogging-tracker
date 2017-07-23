const chai = require('./chai')

const baseUrl = 'http://localhost:5000'
const url = '/api/oauth2/revoke'

describe('/api/oauth2/revoke', () => {

  before(async() => chai.setup(baseUrl))
  after(async() => chai.setup(baseUrl))

  it('should be accessible', async() => {
    const res = await chai.options(baseUrl, url)
    res.should.have.status(200)
    res.text.should.equal('POST')
  })

  it('should not revoke a token if incorrect credentials are passed', async() => {
    chai.post(baseUrl, url, 'Basic').end((err, res) => {
      res.should.have.status(400)
    })
  })

  it('should revoke an issued token if correct credentials are passed', async() => {
    const res = await chai.post(baseUrl, url)
    res.should.have.status(200)
  })
})