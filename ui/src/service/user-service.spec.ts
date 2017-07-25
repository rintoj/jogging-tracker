import 'jsdom-global/register'

import { chai, expect } from '../test/index'

import { User } from '../state/user'
import { api } from './api'
import { userService } from './user-service'

const user: User = {
  id: 'user', name: 'User', authInfo: { roles: ['user'] }
}

describe('user-service', () => {

  before(() => chai.simulateBrowser())

  it('should fetch users', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: [user]
    })))
    api.get = spy
    userService.fetch()
    spy.should.have.been.called.with('/oauth2/user')
  })

  it('should save a user', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: []
    })))
    api.put = spy
    userService.save(user, 'password')
    spy.should.have.been.called.with('/oauth2/user', {
      userId: user.id,
      name: user.name,
      picture: user.picture,
      roles: user.authInfo.roles,
      password: 'password'
    })
  })

  it('should save a user in createOnly mode', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: [],
      status: 304
    })))
    api.put = spy
    userService.save(user, 'password', true).then(undefined, () => undefined)
    spy.should.have.been.called.with('/oauth2/user?createOnly=true', {
      userId: user.id,
      name: user.name,
      picture: user.picture,
      roles: user.authInfo.roles,
      password: 'password'
    })
  })

  it('should register a user', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: {}
    })))
    api.post = spy
    userService.register(user, 'password').then(() => undefined)
    spy.should.have.been.called.with('/oauth2/register', {
      userId: user.id,
      name: user.name,
      picture: user.picture,
      roles: user.authInfo.roles,
      password: 'password'
    })
  })

  it('should remove a user', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: {}
    })))
    api.delete = spy
    userService.remove('user1').then(() => undefined)
    spy.should.have.been.called.with('/oauth2/user/user1')
  })

  it('should sign in a user', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: {
        'token_type': 'bearer',
        'access_token': '8be3317bd6c625c826ba17490132c42f760ae552',
        'expires_in': 3600,
        'refresh_token': '406b0d94e9cd302fbd5fa1b89452d54ff6ec7278'
      }
    })))
    api.post = spy
    userService.signIn('user1', 'password').then(() => undefined)
    spy.should.have.been.called.with('/oauth2/token')
  })

  it('should sign out a user', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: {}
    })))
    api.post = spy
    userService.signOut().then(() => undefined)
    spy.should.have.been.called.with('/oauth2/revoke')
  })

  it('should fetch profile of a user', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: {}
    })))
    api.get = spy
    userService.fetchProfile('access_token', 'user1').then(() => undefined)
    spy.should.have.been.called.with('/profile/user1', undefined, {
      authToken: 'access_token'
    })
  })

  it('should check if a user is authenticated', () => {
    let result = userService.isAuthenticated(undefined)
    expect(result).to.equal(false)
    result = userService.isAuthenticated({ expiresAt: new Date().getTime() })
    expect(result).to.equal(false)
    result = userService.isAuthenticated({ expiresAt: new Date().getTime() + 3600 })
    expect(result).to.equal(true)
  })

  it('should return previous session without errors', () => {
    userService.getSession()
  })

})