import 'jsdom-global/register'

import * as React from 'react'

import { HideFormAction, SaveJogLogAction } from '../../action/index'
import { chai, expect } from '../../test'
import { mount, render } from 'enzyme'

import { MakeAnEntryDialog } from './make-an-entry-dialog'

const jogLog = {
  date: '2017-12-12',
  distance: 1.2,
  time: [0, 59]
}
const invalidJogLog = {
  date: '2017-12-12',
  distance: -1,
  time: [-100, -10]
}

describe('<MakeAnEntryDialog/>', () => {

  it('should render the form', () => {
    const wrapper = render(<MakeAnEntryDialog />)
    const inputs = wrapper.find('input')
    expect(inputs).to.have.length(4)
    const buttons = wrapper.find('button')
    expect(buttons).to.have.length(2)
  })

  it('should show error messages if clicked on submit button without entering anything', () => {
    const wrapper = mount(<MakeAnEntryDialog />)
    wrapper.find('button').at(0).simulate('click')
    const errors = wrapper.find('.error-text')
    expect(errors).to.have.length(3)
    expect(errors.at(0).text()).to.equal('Required')
    expect(errors.at(1).text()).to.equal('Required')
    expect(errors.at(2).text()).to.equal('Required')
  })

  it('should show error messages if time and distance are invalid', () => {
    const wrapper = mount(<MakeAnEntryDialog />)
    wrapper.setProps({ jogLog: invalidJogLog })
    wrapper.find('button').at(0).simulate('click')
    const errors = wrapper.find('.error-text')
    expect(errors).to.have.length(3)
    expect(errors.at(1).text()).to.equal('Invalid distance')
    expect(errors.at(2).text()).to.equal('Invalid time')
  })

  it('should render without error if jogLog is undefined', () => {
    const wrapper = mount(<MakeAnEntryDialog />)
    wrapper.setProps({ jogLog: undefined })
    wrapper.find('button').at(0).simulate('click')
  })

  it('should not navigate to /logs if save fails', () => {
    const spy = chai.spy(() => new Promise((resolve, reject) => {
      throw new Error('Simulated error')
    }))
    const history = []
    SaveJogLogAction.prototype.dispatch = spy
    const wrapper = mount(<MakeAnEntryDialog />)
    wrapper.setProps({ jogLog, history })
    wrapper.find('button').at(0).simulate('click')
    expect(history).to.have.length(0)
  })

  it('should dispatch SaveJogLogAction and navigate to /logs when saved', async () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve()))
    const history = []
    SaveJogLogAction.prototype.dispatch = spy
    const wrapper = mount(<MakeAnEntryDialog />)
    wrapper.setProps({ jogLog, history })
    wrapper.find('button').at(0).simulate('click')
    spy.should.have.been.called()
    setTimeout(() => {
      expect(history[0]).to.equal('/logs')
    }, 100)
  })

  it('should dispatch SaveJogLogAction and navigate to /logs when saved', async () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve()))
    const history = []
    SaveJogLogAction.prototype.dispatch = spy
    const wrapper = mount(<MakeAnEntryDialog history={history} />)
    wrapper.setState({ jogLog: {} })
    const inputs = wrapper.find('input')
    inputs.at(0).simulate('change', { target: { value: '2017-05-02' } })
    inputs.at(1).simulate('change', { target: { value: '1.2' } })
    inputs.at(2).simulate('change', { target: { value: '1' } })
    inputs.at(3).simulate('change', { target: { value: '30' } })
    wrapper.find('button').at(0).simulate('click')
    spy.should.have.been.called()
    setTimeout(() => {
      expect(history[0]).to.equal('/logs')
    }, 100)
  })

  it('should close the dialog once the save is completed', async () => {
    SaveJogLogAction.prototype.dispatch = chai.spy(() => new Promise((resolve) => resolve()))
    const spy = chai.spy()
    HideFormAction.prototype.dispatch = spy
    const wrapper = mount(<MakeAnEntryDialog />)
    wrapper.setProps({ jogLog, history: [] })
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => {
      spy.should.have.been.called()
    }, 100)
  })

  it('should close the dialog when close button is clicked', async () => {
    const spy = chai.spy()
    HideFormAction.prototype.dispatch = spy
    const wrapper = mount(<MakeAnEntryDialog />)
    wrapper.find('button').at(1).simulate('click')
    spy.should.have.been.called()
  })

  it('should close the dialog when backdrop of the dialog is clicked', async () => {
    const spy = chai.spy()
    HideFormAction.prototype.dispatch = spy
    const wrapper = mount(<MakeAnEntryDialog />)
    wrapper.find('.backdrop-node').simulate('click')
    spy.should.have.been.called()
  })

})
