const chai = require('chai')

const baseUrl = 'http://localhost:5000'
const url = '/api/profile'

describe(url, () => {

  before(async() => await chai.setup(baseUrl))
  after(async() => await chai.setup(baseUrl))

  it('should be accessible', async() => {
    const res = await chai.options(baseUrl, url)
    res.should.have.status(200)
    res.text.should.equal('GET,HEAD')
  })

  it('should return profile of the current user as admin', async() => {
    const res = await chai.get(baseUrl, url)
    res.should.have.status(200)
    const result = res.body
    result.should.be.a('object')
    result.should.have.property('id')
    result.id.should.be.equal('admin')
    result.should.have.property('roles')
    result.roles.should.be.a('array')
    result.roles.should.be.length(1)
    result.roles[0].should.be.equal('admin')
  })

  it('should always return profile of the current user even if any other user is specified', async() => {
    const res = await chai.get(baseUrl, `${url}?user=user`)
    res.should.have.status(200)
    const result = res.body
    result.should.be.a('object')
    result.should.have.property('id')
    result.id.should.be.equal('admin')
    result.should.have.property('roles')
    result.roles.should.be.a('array')
    result.roles.should.be.length(1)
    result.roles[0].should.be.equal('admin')
  })

  it('should return profile of the current user as manager', async() => {
    await chai.login(baseUrl, 'manager')
    const res = await chai.get(baseUrl, url)
    res.should.have.status(200)
    const result = res.body
    result.should.be.a('object')
    result.should.have.property('id')
    result.id.should.be.equal('manager')
    result.should.have.property('roles')
    result.roles.should.be.a('array')
    result.roles.should.be.length(1)
    result.roles[0].should.be.equal('manager')
  })

  it('should return profile of the current user as user', async() => {
    await chai.login(baseUrl, 'user')
    const res = await chai.get(baseUrl, url)
    res.should.have.status(200)
    const result = res.body
    result.should.be.a('object')
    result.should.have.property('id')
    result.id.should.be.equal('user')
    result.should.have.property('roles')
    result.roles.should.be.a('array')
    result.roles.should.be.length(1)
    result.roles[0].should.be.equal('user')
  })
})