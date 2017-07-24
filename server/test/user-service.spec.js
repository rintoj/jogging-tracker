const chai = require('./chai')
const expect = chai.expect

const baseUrl = 'http://localhost:5000'
const url = '/api/oauth2/user'

describe(url, () => {

  before(async() => await chai.setup(baseUrl))
  after(async() => await chai.cleanup(baseUrl))

  it('should be accessible', async() => {
    const res = await chai.request(baseUrl).options(url)
    res.should.have.status(200)
    res.text.should.equal('PUT,GET,HEAD,POST,DELETE')
  })

  describe('as admin', () => {

    before(async() => await chai.login(baseUrl, 'admin'))

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
      const res = await chai.get(baseUrl, url)
      res.should.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.be.greaterThan(2)
    })

    it('should return list of users, if POST used with access token', async() => {
      const res = await chai.post(baseUrl, url)
      res.should.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.be.greaterThan(2)
    })

    it('should create a user, if PUT used with access token', async() => {
      try {
        await chai.delete(baseUrl, `${url}/new-user-123`)
      } catch (e) {
        // it's ok to ignore. just wanted to delete user if exists
      }

      const res = await chai.put(baseUrl, url).send({
        userId: 'new-user-123',
        name: 'Sys Admin'
      })
      res.should.have.status(200)
      expect(res.body.item).to.be.an('object')
      expect(res.body.item.userId).to.be.equal('new-user-123')
      expect(res.body.item.name).to.be.equal('Sys Admin')
    })

    it('should update a user, if PUT used with access token', async() => {
      const res = await chai.put(baseUrl, url).send({
        userId: 'admin',
        name: 'System Admin'
      })
      res.should.have.status(200)
      const result = await chai.get(baseUrl, `${url}/admin`)
      result.should.have.status(200)
      result.body.should.be.an('object')
      result.body.name.should.be.equal('System Admin')
    })

    it('should delete a user, if DELETE used with access token', async() => {
      try {
        await chai.put(baseUrl, url).send({
          userId: 'new-user-123',
          name: 'Sys Admin'
        })
      } catch (e) {
        // create first but ignore any errors
      }

      const res = await chai.delete(baseUrl, `${url}/new-user-123`)
      res.should.have.status(200)
      expect(res.body.item).to.be.an('object')
      expect(res.body.item.name).to.be.equal('Sys Admin')
    })
  })

  describe('as manager', () => {

    before(async() => await chai.login(baseUrl, 'manager'))

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
      const res = await chai.get(baseUrl, url)
      res.should.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.be.greaterThan(2)
    })

    it('should return list of users, if POST used with access token', async() => {
      const res = await chai.post(baseUrl, url)
      res.should.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.be.greaterThan(2)
    })

    it('should create a user, if PUT used with access token', async() => {
      try {
        await chai.delete(baseUrl, `${url}/new-user-123`)
      } catch (e) {
        // it's ok to ignore. just wanted to delete user if exists
      }

      const res = await chai.put(baseUrl, url).send({
        userId: 'new-user-123',
        name: 'Sys Admin'
      })
      res.should.have.status(200)
      expect(res.body.item).to.be.an('object')
      expect(res.body.item.userId).to.be.equal('new-user-123')
      expect(res.body.item.name).to.be.equal('Sys Admin')
    })

    it('should update a user, if PUT used with access token', async() => {
      const res = await chai.put(baseUrl, url).send({
        userId: 'admin',
        name: 'System Admin - Updated by manager'
      })
      res.should.have.status(200)
      const result = await chai.get(baseUrl, `${url}/admin`)
      result.should.have.status(200)
      result.body.should.be.an('object')
      result.body.name.should.be.equal('System Admin - Updated by manager')
    })

    it('should delete a user, if DELETE used with access token', async() => {
      try {
        await chai.put(baseUrl, url).send({
          userId: 'new-user-123',
          name: 'Sys Admin'
        })
      } catch (e) {
        // create first but ignore any errors
      }

      const res = await chai.delete(baseUrl, `${url}/new-user-123`)
      res.should.have.status(200)
      expect(res.body.item).to.be.an('object')
      expect(res.body.item.name).to.be.equal('Sys Admin')
    })
  })

  describe('as user', () => {

    before(async() => await chai.login(baseUrl, 'user'))

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
      const res = await chai.get(baseUrl, url)
      res.should.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.be.greaterThan(2)
    })

    it('should deny access event if POST used with access token', async() => {
      chai.post(baseUrl, url)
        .end((err, res) => res.should.have.status(401))
    })

    it('should deny from deleting a user, event if DELETE used with access token', async() => {
      chai.delete(baseUrl, url).send({
        userId: 'manager'
      }).end((err, res) => {
        res.should.have.status(401)
      })
    })

    it('should deny from deleting a user, event if DELETE used with access token', async() => {
      chai.delete(baseUrl, `${url}/manager`).end((err, res) => {
        res.should.have.status(401)
      })
    })

    it('should deny access to creating a user, event if PUT used with access token', async() => {
      chai.put(baseUrl, url).send({
        userId: 'new-user-123',
        name: 'Sys Admin'
      }).end((err, res) => res.should.have.status(401))
    })
  })

})