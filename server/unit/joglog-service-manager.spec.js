const chai = require('chai')
const expect = chai.expect

const baseUrl = 'http://localhost:5000'
const url = '/api/joglog'

describe(url, () => {

  before(async() => {
    await chai.setup(baseUrl)
    try {
      await chai.delete(baseUrl, `${url}/log1`)
    } catch (e) {
      // ignore if fails
    }
  })
  after(async() => await chai.cleanup(baseUrl))

  describe('as manager', () => {

    before(async() => await chai.login(baseUrl, 'manager'))

    it('should be accessible', async() => {
      const res = await chai.options(baseUrl, url)
      res.should.have.status(200)
      res.text.should.equal('PUT,GET,HEAD,POST,DELETE')
    })

    it('should allow to create a log and calculate average speed', async() => {
      const res = await chai.put(baseUrl, url).send({
        id: 'log1',
        date: '2017-12-12',
        distance: 1.3,
        time: [1, 2]
      })
      res.should.have.status(200)
      const result = await chai.get(baseUrl, `${url}/log1`)
      result.should.have.status(200)
      result.body.should.have.property('averageSpeed')
      result.body.averageSpeed.should.be.equal(1.26)
    })

    it('should allow to create a log for another user', async() => {
      await chai.delete(baseUrl, `${url}/log1`)
      const res = await chai.put(baseUrl, url).send({
        id: 'log1',
        date: '2017-12-12',
        distance: 1.3,
        time: [1, 2],
        user: 'user'
      })
      res.should.have.status(200)
      const result = await chai.get(baseUrl, `${url}/log1`)
      result.should.have.status(200)
      result.body.user.should.be.equal('user')
    })

    it('should allow to fetch the created log with access token', async() => {
      const res = await chai.get(baseUrl, `${url}/log1`)
      res.should.have.status(200)
      res.body.should.be.an('object')
      res.body.should.be.a('object')
      res.body.should.have.property('id')
      res.body.id.should.be.equal('log1')
      res.body.should.have.property('distance')
      res.body.distance.should.be.equal(1.3)
      res.body.should.have.property('user')
      res.body.user.should.be.equal('user')
      res.body.should.have.property('averageSpeed')
      res.body.averageSpeed.should.be.equal(1.26)
      res.body.should.have.property('time')
      res.body.time.should.be.a('array')
      res.body.time.should.be.length(2)
      res.body.time[0].should.be.equal(1)
      res.body.time[1].should.be.equal(2)
      res.body.should.have.property('date')
      res.body.date.should.be.equal('2017-12-12T00:00:00.000Z')
    })

    it('should allow to fetch all the created log with access token', async() => {
      const res = await chai.get(baseUrl, url)
      res.should.have.status(200)
      res.body.should.be.an('array')
      res.body.length.should.be.greaterThan(0)
    })

    it('should allow to update a log and recalculate average speed', async() => {
      const res = await chai.put(baseUrl, url).send({
        id: 'log1',
        date: '2017-12-12',
        distance: 1.4,
        time: [1, 2],
      })
      res.should.have.status(200)
      const result = await chai.get(baseUrl, `${url}/log1`)
      result.should.have.status(200)
      result.body.should.have.property('averageSpeed')
      result.body.averageSpeed.should.be.equal(1.35)
    })

    it('should allow to update other users log and recalculate average speed', async() => {
      let res = await chai.delete(baseUrl, `${url}/log1`)
      res.should.have.status(200)
      res = await chai.put(baseUrl, url).send({
        id: 'log1',
        date: '2017-12-12',
        distance: 1.4,
        time: [1, 2],
        user: 'user'
      })
      res.should.have.status(200)
      res = await chai.put(baseUrl, url).send({
        id: 'log1',
        date: '2017-12-12',
        distance: 1.3,
        time: [1, 2],
        user: 'user'
      })
      res.should.have.status(200)
      const result = await chai.get(baseUrl, `${url}/log1`)
      result.should.have.status(200)
      result.body.should.have.property('averageSpeed')
      result.body.averageSpeed.should.be.equal(1.26)
      result.body.should.have.property('user')
      result.body.user.should.be.equal('user')
    })

    it('should allow to delete an entry if access token is given', async() => {
      const res = await chai.delete(baseUrl, `${url}/log1`)
      res.should.have.status(200)
      chai.delete(baseUrl, `${url}/log1`)
        .end((err, response) => response.should.not.have.status(200))
    })

    it('should allow to delete other users entry', async() => {
      let res = await chai.put(baseUrl, url).send({
        id: 'log1',
        date: '2017-12-12',
        distance: 1.4,
        time: [1, 2],
        user: 'user'
      })
      res.should.have.status(200)
      res = await chai.delete(baseUrl, `${url}/log1`)
      res.should.have.status(200)
      chai.delete(baseUrl, `${url}/log1`)
        .end((err, response) => response.should.not.have.status(200))
    })

    it('should allow an entry only if date, distance, time are present', async() => {
      chai.put(baseUrl, url).send({
        id: 'log1',
        distance: 1.4,
        time: [1, 2]
      }).end((err, res) => res.should.not.have.status(200))

      chai.put(baseUrl, url).send({
        id: 'log1',
        date: '2017-12-12',
        time: [1, 2]
      }).end((err, res) => res.should.not.have.status(200))

      chai.put(baseUrl, url).send({
        id: 'log1',
        date: '2017-12-12',
        distance: 1.4
      }).end((err, res) => res.should.not.have.status(200))
    })

    xit('should allow update to an entry only if date, distance, time are present', async() => {
      chai.post(baseUrl, url).send({
        id: 'log1',
        distance: 1.4,
        time: [1, 2]
      }).end((err, res) => res.should.not.have.status(200))

      chai.post(baseUrl, url).send({
        id: 'log1',
        date: '2017-12-12',
        time: [1, 2]
      }).end((err, res) => res.should.not.have.status(200))

      chai.post(baseUrl, url).send({
        id: 'log1',
        date: '2017-12-12',
        distance: 1.4
      }).end((err, res) => res.should.not.have.status(200))
    })
  })

})