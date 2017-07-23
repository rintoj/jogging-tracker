const chai = require('chai')

const baseUrl = 'http://localhost:5000'
const url = '/api/oauth2/register'

describe(url, () => {

  before(async() => {
    await chai.setup(baseUrl)
    try {
      chai.deleteUser(baseUrl, 'test-user')
    } catch (e) {
      // ignore if fails
    }
  })
  after(async() => await chai.cleanup(baseUrl))

  it('should be accessible', async() => {
    const res = await chai.options(baseUrl, url)
    res.should.have.status(200)
    res.text.should.equal('POST')
  })

  it('should allow to register a user if basic credentials are provided', async() => {
    const res = await chai.post(baseUrl, url, 'Basic')
      .send({
        userId: 'test-user',
        name: 'test-user',
        password: 'test-user',
        roles: ['user ']
      })
    res.should.have.status(200)
  })

  it('should NOT allow to create duplicate users', async() => {
    chai.post(baseUrl, url, 'Basic').send({
      userId: 'test-user',
      name: 'test-user',
      password: 'test-user',
      roles: ['user ']
    }).end((err, res) => {
      res.should.have.status(409)
      res.body.message.should.equal('User is already registered!')
    })
  })

  it('should NOT allow to update users', async() => {
    chai.post(baseUrl, url, 'Bearer').send({
      userId: 'test-user',
      name: 'test-user',
      password: 'test-user',
      roles: ['user ']
    }).end((err, res) => {
      res.should.not.have.status(200)
    })
  })

  it('should NOT allow to delete users', async() => {
    chai.delete(baseUrl, url, 'Bearer').send({
      userId: 'test-user',
      name: 'test-user',
      password: 'test-user',
      roles: ['user ']
    }).end((err, res) => {
      res.should.not.have.status(200)
    })
  })

})