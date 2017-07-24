const chai = require('chai')

// configure chai
chai.should()
chai.use(require('chai-http'))
chai.use(require('chai-sorted'))
chai.use(require('chai-things'))
chai.use(require('chai-match-pattern'))

chai.BASE_AUTH_TOKEN = 'N2Q2NWQ5YjYtNWNhZS00ZGI3LWIxOWQtNTZjYmRkMjVlYWFiOmEwYzdiNzQxLWIxOGItNDdlYi1iNmRmLTQ4YTBiZDNjZGUyZQ=='

const requestTypes = ['get', 'post', 'put', 'head', 'options', 'delete']

// create basic http methods
requestTypes.forEach(request => {
  chai[request] = function(baseUrl, url, authType) {
    const agent = chai.request(baseUrl)[request](url)

    if (authType == null || authType === 'Bearer')
      if (chai.ACCESS_TOKEN != null)
        return agent.set('Authorization', `Bearer ${chai.ACCESS_TOKEN}`)

    if (authType === 'Basic')
      if (chai.BASE_AUTH_TOKEN != null)
        return agent.set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Basic ${chai.BASE_AUTH_TOKEN}`)

    return agent
  }
})

chai.login = function login(baseUrl, userId, password) {
  return new Promise((resolve) => {
    chai.post(baseUrl, '/api/oauth2/token', 'Basic').send({
      'grant_type': 'password',
      'username': userId || 'admin',
      'password': password || userId || 'admin'
    }).end((err, res) => {
      if (err) throw new Error('Login failed')
      res.should.have.status(200)
      chai.ACCESS_TOKEN = res.body.access_token
      resolve()
    })
  })
}

chai.createUser = async function createUser(baseUrl, userId) {
  await chai.put(baseUrl, '/api/oauth2/user').send({
    'name': `${userId} - Created at ${new Date()}`,
    'userId': userId,
    'password': userId,
    'roles': [userId]
  })
}

chai.deleteUser = async function deleteUser(baseUrl, userId) {
  await chai.delete(baseUrl, `/api/oauth2/user/${userId}`)
}

chai.setup = async(baseUrl, userId, password) => {
  try {
    await chai.cleanup(baseUrl)
  } catch (e) {
    // ignore if users not found
  }
  await chai.createUser(baseUrl, 'admin')
  await chai.createUser(baseUrl, 'manager')
  await chai.createUser(baseUrl, 'user')
  await chai.login(baseUrl, userId, password)
}

chai.cleanup = async(baseUrl) => {
  try {
    await chai.login(baseUrl, 'admin@system.com', 'admin')
    await chai.deleteUser(baseUrl, 'admin')
    await chai.deleteUser(baseUrl, 'manager')
    await chai.deleteUser(baseUrl, 'user')
  } catch (e) {
    // ignore any errors
  }
}

module.exports = chai