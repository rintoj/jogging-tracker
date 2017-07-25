import { chai, expect } from '../test/index'

import { api } from './api'

describe('api', () => {


  it('should validate the status to be true if code is between 200 and 300 or 304', () => {
    expect(api.options.validateStatus(100)).to.equal(false)
    expect(api.options.validateStatus(200)).to.equal(true)
    expect(api.options.validateStatus(300)).to.equal(false)
    expect(api.options.validateStatus(304)).to.equal(true)
    expect(api.options.validateStatus(401)).to.equal(false)
    expect(api.options.validateStatus(404)).to.equal(false)
  })



  it('should make http request without errors', () => {
    const spy = chai.spy()
    api.http = spy
    api.configure({
      baseURL: '//localhost:5000/api'
    }, true)
    api.request({ url: '/test', method: 'get' })
    spy.should.have.been.called.with({
      baseURL: '//localhost:5000/api',
      url: '/test',
      method: 'get',
      headers: {}
    })
  })

  it('should make http request with headers', () => {
    const spy = chai.spy()
    api.http = spy
    api.configure(undefined, true)
    api.request({ url: '/test', method: 'get', authToken: 'authToken' })
    spy.should.have.been.called.with({
      url: '/test',
      method: 'get',
      authToken: 'authToken',
      headers: { Authorization: 'Bearer authToken' }
    })
  })
  it('should make get requests', () => {
    const spy = chai.spy()
    api.request = spy
    api.get('/test')
    spy.should.have.been.called.with({ url: '/test', params: undefined, method: 'get' })
  })

  it('should make post requests', () => {
    const spy = chai.spy()
    api.request = spy
    api.post('/test', { test: 'data' })
    spy.should.have.been.called.with({ url: '/test', data: { test: 'data' }, method: 'post' })
  })

  it('should make post requests', () => {
    const spy = chai.spy()
    api.request = spy
    api.put('/test', { test: 'data' })
    spy.should.have.been.called.with({ url: '/test', data: { test: 'data' }, method: 'put' })
  })

  it('should make post requests', () => {
    const spy = chai.spy()
    api.request = spy
    api.delete('/test', { test: 'data' })
    spy.should.have.been.called.with({ url: '/test', data: { test: 'data' }, method: 'delete' })
  })

})