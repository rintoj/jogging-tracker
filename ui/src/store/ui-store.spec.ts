import { HideFormAction, ShowFormAction } from '../action/index'

import { UiStore } from './ui-store'
import { expect } from '../test/index'

describe('ui-store', () => {

  const uiStore = new UiStore()

  it('should process ShowFormAction', () => {
    const action = new ShowFormAction({ id: 'log1' })
    const result = uiStore.showFormAction({}, action)
    expect(result).be.a('object')
    expect(result).have.property('showForm')
    expect(result.showForm).be.equal(true)
    expect(result).have.property('selectedJogLog')
    expect(result.selectedJogLog).be.a('object')
    expect(result.selectedJogLog).have.property('id')
    expect(result.selectedJogLog.id).be.equal('log1')
  })

  it('should process HideFormAction', () => {
    const action = new HideFormAction()
    const result = uiStore.hideFormAction({}, action)
    expect(result).be.a('object')
    expect(result).have.property('showForm')
    expect(result.showForm).be.equal(false)
    expect(result).have.property('selectedJogLog')
    expect(result.selectedJogLog).be.undefined
  })

})