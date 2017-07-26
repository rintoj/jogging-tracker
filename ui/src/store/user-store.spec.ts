import {
  AuthorizeAction,
  FetchUsersAction,
  RegisterUserAction,
  RemoveUserAction,
  SaveUserAction,
  SelectUserAction,
  SetRedirectUrlAction,
  SignInAction,
  SignOutAction
} from '../action/index'
import { chai, expect } from '../test/index'

import { UserStore } from './user-store'
import { services } from '../service/index'
import { toPromise } from '../test/toPromise'

describe('user-store', () => {

  const userStore = new UserStore()

  it('should authorize a user', async () => {
    const state = {}
    const action = new AuthorizeAction(() => undefined)
    const result = await toPromise(userStore.authorize(state, action))
    expect(result).be.a('array')
    expect(result).be.length(2)
    expect(result[0]).be.a('object')
    expect(result[0]).have.property('authInProgress')
    expect(result[0].authInProgress).be.equal(true)
    expect(result[1]).be.a('object')
    expect(result[1]).have.property('authInProgress')
    expect(result[1].authInProgress).be.equal(false)
    expect(result[1]).have.property('user')
    expect(result[1].user).be.undefined
  })

  it('should authorize a user with the session from localStorage as manager', async () => {
    const state = {}
    const action = new AuthorizeAction(() => undefined)
    services.userService.getSession = () => ({
      'accessToken': '8be3317bd6c625c826ba17490132c42f760ae552',
      'expiresAt': new Date().getTime() + 3600 * 60,
      roles: ['manager']
    })
    userStore.onRedirect = () => undefined
    services.userService.fetch = () => new Promise((resolve) => resolve([{ id: 'user1', authInfo: { roles: ['manager'] } }]))
    services.userService.fetchProfile = () => new Promise((resolve) => resolve({ id: 'user1' }))
    userStore.setRedirectUrl(state, new SetRedirectUrlAction('/signin'))
    const result = await toPromise(userStore.authorize(state, action))
    expect(result).be.a('array')
    expect(result).be.length(3)
    expect(result[0]).be.a('object')
    expect(result[0]).have.property('authInProgress')
    expect(result[0].authInProgress).be.equal(true)
    expect(result[1]).be.a('object')
    expect(result[1]).have.property('user')
    expect(result[1].user).be.a('object')
    expect(result[1].user).have.property('id')
    expect(result[1].user.id).be.equal('user1')
    expect(result[1].user).have.property('authInfo')
    expect(result[1].user.authInfo).be.a('object')
    expect(result[1].user.authInfo).have.property('roles')
    expect(result[1].user.authInfo.roles).be.a('array')
    expect(result[1].user.authInfo.roles).be.length(1)
    expect(result[1].user.authInfo.roles[0]).be.equal('manager')
    expect(result[2]).be.a('object')
    expect(result[2]).have.property('users')
    expect(result[2].users).be.a('array')
    expect(result[2].users).be.length(1)
    expect(result[2].users[0]).be.a('object')
    expect(result[2].users[0]).have.property('id')
    expect(result[2].users[0].id).be.equal('user1')
    expect(result[2].users[0]).have.property('authInfo')
    expect(result[2].users[0].authInfo).be.a('object')
    expect(result[2].users[0].authInfo).have.property('roles')
    expect(result[2].users[0].authInfo.roles).be.a('array')
    expect(result[2].users[0].authInfo.roles).be.length(1)
    expect(result[2].users[0].authInfo.roles[0]).be.equal('manager')
    expect(result[2]).have.property('selectedUser')
    expect(result[2].selectedUser).be.a('object')
    expect(result[2].selectedUser).have.property('id')
    expect(result[2].selectedUser.id).be.equal('user1')
    expect(result[2].selectedUser).have.property('authInfo')
    expect(result[2].selectedUser.authInfo).be.a('object')
    expect(result[2].selectedUser.authInfo).have.property('roles')
    expect(result[2].selectedUser.authInfo.roles).be.a('array')
    expect(result[2].selectedUser.authInfo.roles).be.length(1)
    expect(result[2].selectedUser.authInfo.roles[0]).be.equal('manager')
  })

  it('should authorize a user with the session from localStorage as a user', async () => {
    const state = {}
    const action = new AuthorizeAction(() => undefined)
    services.userService.getSession = () => ({
      'accessToken': '8be3317bd6c625c826ba17490132c42f760ae552',
      'expiresAt': new Date().getTime() + 3600 * 60,
      roles: ['user']
    })
    userStore.onRedirect = () => undefined
    services.userService.fetch = () => new Promise((resolve) => resolve([{ id: 'user1', authInfo: { roles: ['user'] } }]))
    services.userService.fetchProfile = () => new Promise((resolve) => resolve({ id: 'user1' }))
    userStore.setRedirectUrl(state, new SetRedirectUrlAction('/signin'))
    const result = await toPromise(userStore.authorize(state, action))
    expect(result).be.a('array')
    expect(result).be.length(2)
    expect(result[0]).be.a('object')
    expect(result[0]).have.property('authInProgress')
    expect(result[0].authInProgress).be.equal(true)
    expect(result[1]).be.a('object')
    expect(result[1]).have.property('user')
    expect(result[1].user).be.a('object')
    expect(result[1].user).have.property('id')
    expect(result[1].user.id).be.equal('user1')
    expect(result[1].user).have.property('authInfo')
    expect(result[1].user.authInfo).be.a('object')
    expect(result[1].user.authInfo).have.property('roles')
    expect(result[1].user.authInfo.roles).be.a('array')
    expect(result[1].user.authInfo.roles).be.length(1)
    expect(result[1].user.authInfo.roles[0]).be.equal('user')
  })

  it('should clear the session if fetch profile fails', async () => {
    const spy = chai.spy()
    services.userService.clearSession = spy
    services.userService.fetchProfile = () => new Promise((resolve, reject) => reject())
    const state = {}
    const action = new AuthorizeAction(() => undefined)
    const result = await toPromise(userStore.authorize(state, action))
    spy.should.have.been.called()
    expect(result).be.a('array')
    expect(result).be.length(2)
    expect(result[0]).be.a('object')
    expect(result[0]).have.property('authInProgress')
    expect(result[0].authInProgress).be.equal(true)
    expect(result[1]).be.a('object')
    expect(result[1]).have.property('authInProgress')
    expect(result[1].authInProgress).be.equal(false)
    expect(result[1]).have.property('user')
    expect(result[1].user).be.undefined
  })

  it('should set redirect url', () => {
    const state = {}
    const action = new SetRedirectUrlAction('/logs')
    const result = userStore.setRedirectUrl(state, action)
    expect(result).be.a('object')
  })

  it('should save a user', async () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve()))
    services.userService.save = spy
    const state = {}
    const action = new SaveUserAction({ id: 'user1' }, 'password1')
    const result = await userStore.saveUser(state, action)
    expect(result).be.a('object')
  })

  it('should fetch users', async () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve([
      { id: 'user' }, { id: 'admin' }, { id: 'manager' }
    ])))
    services.userService.fetch = spy
    const state = { user: { id: 'user' } }
    const action = new FetchUsersAction()
    const result: any = await toPromise(userStore.fetchUsers(state, action))
    expect(result).be.a('array')
    expect(result).be.length(1)
    expect(result[0]).be.a('object')
    expect(result[0]).have.property('users')
    expect(result[0].users).be.a('array')
    expect(result[0].users).be.length(3)
    expect(result[0].users[0]).be.a('object')
    expect(result[0].users[0]).have.property('id')
    expect(result[0].users[0].id).be.equal('user')
    expect(result[0].users[1]).be.a('object')
    expect(result[0].users[1]).have.property('id')
    expect(result[0].users[1].id).be.equal('admin')
    expect(result[0].users[2]).be.a('object')
    expect(result[0].users[2]).have.property('id')
    expect(result[0].users[2].id).be.equal('manager')
    expect(result[0]).have.property('selectedUser')
    expect(result[0].selectedUser).be.a('object')
    expect(result[0].selectedUser).have.property('id')
    expect(result[0].selectedUser.id).be.equal('user')
  })

  it('should handle gracefully if fetch users fail', async () => {
    const spy = chai.spy(() => new Promise((resolve, reject) => reject()))
    services.userService.fetch = spy
    const state = { user: { id: 'user' } }
    const action = new FetchUsersAction()
    const result: any = await toPromise(userStore.fetchUsers(state, action))
    expect(result).be.a('array')
    expect(result).be.empty
  })

  it('should register a user', async () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve()))
    services.userService.register = spy
    const state = {}
    const action = new RegisterUserAction({ id: 'user1' }, 'password1')
    const result = await userStore.registerUser(state, action)
    expect(result).be.a('object')
  })

  it('should remove a user', async () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve()))
    services.userService.remove = spy
    const state = { users: [{ id: 'user1' }, { id: 'user2' }] }
    const action = new RemoveUserAction('user1')
    const result = await userStore.removeProfile(state, action)
    expect(result).be.a('object')
    expect(result).have.property('users')
    expect(result.users).be.a('array')
    expect(result.users).be.length(1)
    expect(result.users[0]).be.a('object')
    expect(result.users[0]).have.property('id')
    expect(result.users[0].id).be.equal('user2')
  })

  it('should remove a user without any errors even if state has no users', async () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve()))
    services.userService.remove = spy
    const state = {}
    const action = new RemoveUserAction('user1')
    const result = await userStore.removeProfile(state, action)
    expect(result).be.a('object')
  })

  it('should sign in a user', async () => {
    services.userService.fetch = chai.spy(() => new Promise((resolve, reject) => resolve([
      { id: 'user' }, { id: 'manager' }, { id: 'admin' }
    ])))
    services.userService.signIn = chai.spy(() => new Promise((resolve, reject) => resolve({
      id: 'user',
      authInfo: { roles: ['user'] }
    })))
    const state = { user: { id: 'user' } }
    const action = new SignInAction('user1', 'password')
    const result: any = await toPromise(userStore.signIn(state, action))
    expect(result).be.a('array')
    expect(result).be.length(2)
    expect(result[0]).be.a('object')
    expect(result[0]).have.property('draftUser')
    expect(result[0].draftUser).be.undefined
    expect(result[0]).have.property('authInProgress')
    expect(result[0].authInProgress).be.equal(true)
    expect(result[1]).be.a('object')
    expect(result[1]).have.property('user')
    expect(result[1].user).be.a('object')
    expect(result[1].user).have.property('id')
    expect(result[1].user.id).be.equal('user')
    expect(result[1].user).have.property('authInfo')
    expect(result[1].user.authInfo).be.a('object')
    expect(result[1].user.authInfo).have.property('roles')
    expect(result[1].user.authInfo.roles).be.a('array')
    expect(result[1].user.authInfo.roles).be.length(1)
    expect(result[1].user.authInfo.roles[0]).be.equal('user')
    expect(result[1]).have.property('authInProgress')
    expect(result[1].authInProgress).be.equal(false)
  })

  it('should sign in a user as admin', async () => {
    services.userService.fetch = chai.spy(() => new Promise((resolve, reject) => resolve([
      { id: 'user' }, { id: 'manager' }, { id: 'admin' }
    ])))
    services.userService.signIn = chai.spy(() => new Promise((resolve, reject) => resolve({
      id: 'user',
      authInfo: { roles: ['admin'] }
    })))
    const state = {}
    const action = new SignInAction('user', 'password')
    userStore.onRedirect = () => undefined
    userStore.setRedirectUrl(state, new SetRedirectUrlAction('/signin'))
    const result: any = await toPromise(userStore.signIn(state, action))
    expect(result).be.a('array')
    expect(result).be.length(3)
    expect(result[0]).be.a('object')
    expect(result[0]).have.property('draftUser')
    expect(result[0].draftUser).be.undefined
    expect(result[0]).have.property('authInProgress')
    expect(result[0].authInProgress).be.equal(true)
    expect(result[1]).be.a('object')
    expect(result[1]).have.property('user')
    expect(result[1].user).be.a('object')
    expect(result[1].user).have.property('id')
    expect(result[1].user.id).be.equal('user')
    expect(result[1].user).have.property('authInfo')
    expect(result[1].user.authInfo).be.a('object')
    expect(result[1].user.authInfo).have.property('roles')
    expect(result[1].user.authInfo.roles).be.a('array')
    expect(result[1].user.authInfo.roles).be.length(1)
    expect(result[1].user.authInfo.roles[0]).be.equal('admin')
    expect(result[1]).have.property('authInProgress')
    expect(result[1].authInProgress).be.equal(false)
    expect(result[2]).be.a('object')
    expect(result[2]).have.property('users')
    expect(result[2].users).be.a('array')
    expect(result[2].users).be.length(3)
    expect(result[2].users[0]).be.a('object')
    expect(result[2].users[0]).have.property('id')
    expect(result[2].users[0].id).be.equal('user')
    expect(result[2].users[1]).be.a('object')
    expect(result[2].users[1]).have.property('id')
    expect(result[2].users[1].id).be.equal('manager')
    expect(result[2].users[2]).be.a('object')
    expect(result[2].users[2]).have.property('id')
    expect(result[2].users[2].id).be.equal('admin')
    expect(result[2]).have.property('selectedUser')
    expect(result[2].selectedUser).be.a('object')
    expect(result[2].selectedUser).have.property('id')
    expect(result[2].selectedUser.id).be.equal('user')
  })

  it('should sign in a user as manager', async () => {
    services.userService.fetch = chai.spy(() => new Promise((resolve, reject) => resolve([
      { id: 'user' }, { id: 'manager' }, { id: 'admin' }
    ])))
    services.userService.signIn = chai.spy(() => new Promise((resolve, reject) => resolve({
      id: 'user',
      authInfo: { roles: ['manager'] }
    })))
    const state = {}
    const action = new SignInAction('user', 'password')
    userStore.onRedirect = () => undefined
    userStore.setRedirectUrl(state, new SetRedirectUrlAction('/home'))
    const result: any = await toPromise(userStore.signIn(state, action))
    expect(result).be.a('array')
    expect(result).be.length(3)
    expect(result[0]).be.a('object')
    expect(result[0]).have.property('draftUser')
    expect(result[0].draftUser).be.undefined
    expect(result[0]).have.property('authInProgress')
    expect(result[0].authInProgress).be.equal(true)
    expect(result[1]).be.a('object')
    expect(result[1]).have.property('user')
    expect(result[1].user).be.a('object')
    expect(result[1].user).have.property('id')
    expect(result[1].user.id).be.equal('user')
    expect(result[1].user).have.property('authInfo')
    expect(result[1].user.authInfo).be.a('object')
    expect(result[1].user.authInfo).have.property('roles')
    expect(result[1].user.authInfo.roles).be.a('array')
    expect(result[1].user.authInfo.roles).be.length(1)
    expect(result[1].user.authInfo.roles[0]).be.equal('manager')
    expect(result[1]).have.property('authInProgress')
    expect(result[1].authInProgress).be.equal(false)
    expect(result[2]).be.a('object')
    expect(result[2]).have.property('users')
    expect(result[2].users).be.a('array')
    expect(result[2].users).be.length(3)
    expect(result[2].users[0]).be.a('object')
    expect(result[2].users[0]).have.property('id')
    expect(result[2].users[0].id).be.equal('user')
    expect(result[2].users[1]).be.a('object')
    expect(result[2].users[1]).have.property('id')
    expect(result[2].users[1].id).be.equal('manager')
    expect(result[2].users[2]).be.a('object')
    expect(result[2].users[2]).have.property('id')
    expect(result[2].users[2].id).be.equal('admin')
    expect(result[2]).have.property('selectedUser')
    expect(result[2].selectedUser).be.a('object')
    expect(result[2].selectedUser).have.property('id')
    expect(result[2].selectedUser.id).be.equal('user')
  })

  it('should redirect user to home after login', async () => {
    const spy = chai.spy()
    services.userService.signIn = chai.spy(() => new Promise((resolve, reject) => resolve({
      id: 'user',
      authInfo: { roles: ['user'] }
    })))
    const state = { user: { id: 'user' } }
    const action = new SignInAction('user1', 'password')
    userStore.authorize(state, new AuthorizeAction(spy))
    userStore.setRedirectUrl(state, new SetRedirectUrlAction('/signin'))
    await toPromise(userStore.signIn(state, action))
    spy.should.have.been.called.with('/')
  })

  it('should handle sign in failure gracefully', (done) => {
    services.userService.signIn = chai.spy(() => new Promise((resolve, reject) => reject()))
    const state = { user: { id: 'user' } }
    const action = new SignInAction('user1', 'password')
    toPromise(userStore.signIn(state, action)).then(undefined, () => {
      done()
    })
  })

  it('should sign out a user', (done) => {
    const spy = chai.spy(() => new Promise((resolve) => resolve()))
    services.userService.signOut = spy
    const state = {}
    const action = new SignOutAction()
    userStore.signOut(state, action).then(result => {
      expect(result).be.a('object')
      expect(result).have.property('user')
      expect(result.user).be.undefined
      expect(result).have.property('selectedUser')
      expect(result.selectedUser).be.undefined
      expect(result).have.property('authInProgress')
      expect(result.authInProgress).be.equal(false)
      spy.should.have.been.called()
      done()
    })
  })

  it('should reset the state after user sign out fails', (done) => {
    const spy = chai.spy(() => new Promise((resolve, reject) => reject()))
    services.userService.signOut = spy
    const state = {}
    const action = new SignOutAction()
    userStore.signOut(state, action).then(result => {
      expect(result).be.a('object')
      expect(result).have.property('user')
      expect(result.user).be.undefined
      expect(result).have.property('selectedUser')
      expect(result.selectedUser).be.undefined
      expect(result).have.property('authInProgress')
      expect(result.authInProgress).be.equal(false)
      spy.should.have.been.called()
      done()
    })
  })

  it('should set a selected user', () => {
    const state = {}
    const action = new SelectUserAction({ id: 'user1' })
    const result = userStore.selectUser(state, action)
    expect(result).be.a('object')
    expect(result).have.property('selectedUser')
    expect(result.selectedUser).be.a('object')
    expect(result.selectedUser).have.property('id')
    expect(result.selectedUser.id).be.equal('user1')
  })

  it('should return redirect url as stored in localStorage', () => {
    localStorage.setItem('redirect_url', '/home')
    userStore._redirectUrl = undefined
    const result = userStore.redirectUrl
    expect(result).be.equal('/home')
  })

  it('should return redirect url as home if localStorage is undefined', () => {
    localStorage.setItem('redirect_url', undefined)
    userStore._redirectUrl = undefined
    const result = userStore.redirectUrl
    expect(result).be.equal('/home')
  })

  it('should store redirect url into localStorage only if it is valid string', () => {
    localStorage.setItem('redirect_url', '/home')
    userStore._redirectUrl = undefined
    userStore.redirectUrl = undefined
    expect(localStorage.getItem('redirect_url')).be.equal('/home')
  })

  it('should validate and return /signin if session in invalid', () => {
    services.userService.getSession = () => undefined
    expect(userStore.validateUrl('/authorize')).be.equal('/signin')
  })

})