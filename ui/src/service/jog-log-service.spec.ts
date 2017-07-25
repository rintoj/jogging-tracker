import 'jsdom-global/register'

import { JogLog } from '../state/jog-log';
import { api } from './api'
import { chai } from '../test/index'
import { jogLogService } from './jog-log-service'

describe('jog-log-service', () => {

  before(() => chai.simulateBrowser())

  it('should fetch logs for the given user', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: {}
    })))
    api.post = spy
    jogLogService.fetch(undefined, 'user1')
    spy.should.have.been.called.with('/joglog', { user: 'user1' })
  })

  it('should fetch logs for the given user and as per filters', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: {}
    })))
    api.post = spy
    jogLogService.fetch({ fromDate: '2012-12-12', toDate: '2012-12-13' }, 'user1')
    spy.should.have.been.called.with('/joglog', {
      date: {
        $gte: new Date('2012-12-12'),
        $lte: new Date('2012-12-13')
      },
      user: 'user1'
    })
  })

  it('should fetch logs for the given user and as per from date', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: {}
    })))
    api.post = spy
    jogLogService.fetch({ fromDate: '2012-12-12' }, 'user1')
    spy.should.have.been.called.with('/joglog', {
      date: {
        $gte: new Date('2012-12-12')
      },
      user: 'user1'
    })
  })

  it('should fetch logs for the given user and as per to date', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: {}
    })))
    api.post = spy
    jogLogService.fetch({ toDate: '2012-12-12' }, 'user1')
    spy.should.have.been.called.with('/joglog', {
      date: {
        $lte: new Date('2012-12-12')
      },
      user: 'user1'
    })
  })

  it('should save a jog log', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: {}
    })))
    api.put = spy
    const log: JogLog = { date: '2012-12-12', distance: 1.2, time: [1, 2] }
    jogLogService.save(log, 'user1')
    spy.should.have.been.called.with('/joglog', {
      date: '2012-12-12',
      distance: 1.2,
      time: [1, 2],
      user: 'user1'
    })
  })

  it('should remove a jog log', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: {}
    })))
    api.delete = spy
    jogLogService.remove('log1', 'user1')
    spy.should.have.been.called.with('/joglog/log1', {
      user: 'user1'
    })
  })

})