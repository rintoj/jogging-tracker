import 'jsdom-global/register'

import { api } from './api'
import { chai } from '../test/index'
import { statisticsService } from './statistics-service'

describe('statistics-service', () => {

  before(() => chai.simulateBrowser())

  it('should fetch statistics for the given user', () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve({
      data: {}
    })))
    api.get = spy
    statisticsService.fetch('user1')
    spy.should.have.been.called.with('/statistics?user=user1')
  })
})