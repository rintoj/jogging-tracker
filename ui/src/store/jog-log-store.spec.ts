import { FetchJogLogsAction, RemoveJogLogAction, SaveJogLogAction } from '../action/index'
import { chai, expect } from '../test/index'

import { JogLogStore } from './jog-log-store'
import { services } from '../service/index'

describe('jog-log-service', () => {
  const jogLogStore = new JogLogStore()

  it('should fetch logs', (done) => {
    services.jogLogService.fetch = () => new Promise((resolve) => resolve([{ id: 'log1' }]))
    const result = []
    const action = new FetchJogLogsAction()
    const subscription = jogLogStore.fetchJogLogs({ selectedUser: { id: 'user1' } }, action)
      .subscribe((response) => result.push(response), undefined, () => {
        expect(result).be.a('array')
        expect(result).be.length(3)
        expect(result[0]).be.a('object')
        expect(result[0]).have.property('filters')
        expect(result[0].filters).be.undefined

        expect(result[1]).be.a('object')
        expect(result[1]).have.property('jogLogs')
        expect(result[1].jogLogs).be.a('array')
        expect(result[1].jogLogs).be.length(1)
        expect(result[1].jogLogs[0]).be.a('object')
        expect(result[1].jogLogs[0]).have.property('id')
        expect(result[1].jogLogs[0].id).be.equal('log1')

        expect(result[2]).be.a('object')
        expect(result[2]).have.property('requestInProgress')
        expect(result[2].requestInProgress).be.equal(false)

        done()
        subscription.unsubscribe()
      })
  })

  it('should save logs', (done) => {
    const spy: any = chai.spy(() => new Promise((resolve) => resolve()))
    services.jogLogService.save = spy
    const state = { selectedUser: { id: 'user1' } }
    const action = new SaveJogLogAction({ id: 'log1' })
    const subscription = jogLogStore.saveJogLog(state, action).subscribe(undefined, undefined, () => {
      spy.should.have.been.called()
      done()
      subscription.unsubscribe()
    })
  })

  it('should remove logs', (done) => {
    const spy: any = chai.spy(() => new Promise((resolve) => resolve()))
    services.jogLogService.remove = spy
    const state = { jogLogs: [{ id: 'log1' }] }
    const action = new RemoveJogLogAction('id1')
    const subscription = jogLogStore.removeJogLog(state, action).subscribe(undefined, undefined, () => {
      spy.should.have.been.called()
      done()
      subscription.unsubscribe()
    })
  })

  it('should remove logs without errors even when jog logs is undefined', (done) => {
    const spy: any = chai.spy(() => new Promise((resolve) => resolve()))
    services.jogLogService.remove = spy
    const state = { selectedUser: { id: 'user1' } }
    const action = new RemoveJogLogAction('id1')
    const subscription = jogLogStore.removeJogLog(state, action).subscribe(undefined, undefined, () => {
      spy.should.have.been.called()
      done()
      subscription.unsubscribe()
    })
  })

})