const baseUrl = 'http://localhost:5000'
const chai = require('./chai')(baseUrl)
const expect = chai.expect

describe('/api/oauth2/user', () => {

  const url = '/api/oauth2/user'

  before((done) => {
    chai.login(done)
  })

  it('should be accessible', async() => {
    const res = await chai.request(baseUrl).options(url)
    res.should.have.status(200)
    res.text.should.equal('PUT,GET,HEAD,POST,DELETE')
  })

  it('should deny GET without access token', async() => {
    chai.request(baseUrl).get(url).end((err, res) => {
      res.should.have.status(401)
    })
  })

  it('should deny POST without access token', async() => {
    chai.request(baseUrl).post(url).end((err, res) => {
      res.should.have.status(401)
    })
  })

  it('should deny PUT without access token', async() => {
    chai.request(baseUrl).put(url).end((err, res) => {
      res.should.have.status(401)
    })
  })

  it('should deny DELETE without access token', async() => {
    chai.request(baseUrl).delete(url).end((err, res) => {
      res.should.have.status(401)
    })
  })

  it('should return list of users, if GET used with access token', async() => {
    const res = await chai.request(baseUrl).get(url).set('Authorization', chai.ACCESS_TOKEN)
    res.should.have.status(200)
    expect(res.body).to.be.an('array').that.does.deep.include({
      userId: 'admin@system.com',
      name: 'System Admin',
      active: true,
      roles: ['admin']
    })
  })

  it('should return list of users, if POST used with access token', async() => {
    const res = await chai.request(baseUrl).post(url).set('Authorization', chai.ACCESS_TOKEN)
    res.should.have.status(200)
    expect(res.body).to.be.an('array').that.does.deep.include({
      userId: 'admin@system.com',
      name: 'System Admin',
      active: true,
      roles: ['admin']
    })
  })

  it('should create a user, if PUT used with access token', async() => {
    try {
      await chai.request(baseUrl)
        .delete(`${url}/new-user-123`)
        .set('Authorization', chai.ACCESS_TOKEN)
    } catch (e) {
      // it's ok to ignore. just wanted to delete user if exists
    }

    const res = await chai.request(baseUrl)
      .put(url).set('Authorization', chai.ACCESS_TOKEN)
      .send({
        userId: 'new-user-123',
        name: 'Sys Admin'
      })

    res.should.have.status(200)
    expect(res.body.item).to.be.an('object')
    expect(res.body.item.userId).to.be.equal('new-user-123')
    expect(res.body.item.name).to.be.equal('Sys Admin')
  })

  it('should update a user, if PUT used with access token', async() => {
    const res = await chai.request(baseUrl).put(url).set('Authorization', chai.ACCESS_TOKEN)
      .send({
        name: 'Sys Admin'
      })
    res.should.have.status(200)
    expect(res.body.item).to.be.an('object')
    expect(res.body.item.name).to.be.equal('Sys Admin')
  })

  it('should delete a user, if DELETE used with access token', async() => {
    try {
      await chai.request(baseUrl)
        .put(url).set('Authorization', chai.ACCESS_TOKEN)
        .send({
          userId: 'new-user-123',
          name: 'Sys Admin'
        })
    } catch (e) {
      // create first but ignore any errors
    }

    const res = await chai.request(baseUrl)
      .delete(`${url}/new-user-123`)
      .set('Authorization', chai.ACCESS_TOKEN)

    res.should.have.status(200)
    expect(res.body.item).to.be.an('object')
    expect(res.body.item.name).to.be.equal('Sys Admin')
  })

})