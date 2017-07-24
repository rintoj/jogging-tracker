import 'jsdom-global/register'

import * as React from 'react'

import { RemoveJogLogAction, ShowFormAction } from '../../action/index'
import { chai, expect } from '../../test'
import { mount, render } from 'enzyme'

import { JogLog } from '../../state/jog-log'
import { LogPage } from './log'

const jogLogs: JogLog[] = [{
  date: '2016-12-16 00:00:00',
  distance: 1.48,
  time: [1, 51],
  averageSpeed: 0.8

}, {
  date: '2016-12-30 00:00:00',
  distance: 2.5,
  averageSpeed: 3.3
}]

describe('<LogPage/>', () => {

  it('should render a page', () => {
    const wrapper = render(<LogPage />)
    expect(wrapper.find('.page-node')).to.have.length(1)
  })

  it('should render jog logs as a table', () => {
    const wrapper = mount(<LogPage jogLogs={jogLogs} />)
    expect(wrapper.find('table')).to.have.length(1)
    const rows = wrapper.find('tr')
    expect(rows).to.have.length(3)

    let columns = rows.at(1).find('td')
    expect(columns.at(0).text()).to.have.equal('1')
    expect(columns.at(2).text()).to.have.equal('December 16, 2016')
    expect(columns.at(3).text()).to.have.equal('1.48 km')
    expect(columns.at(4).text()).to.have.equal('01:51')
    expect(columns.at(5).text()).to.have.equal('0.80 km/h')

    columns = rows.at(2).find('td')
    expect(columns.at(0).text()).to.have.equal('2')
    expect(columns.at(2).text()).to.have.equal('December 30, 2016')
    expect(columns.at(3).text()).to.have.equal('2.50 km')
    expect(columns.at(4).text()).to.have.equal('00:00')
    expect(columns.at(5).text()).to.have.equal('3.30 km/h')
  })

  it('should dispatch ShowFormAction when a row is clicked', () => {
    const spy = chai.spy()
    ShowFormAction.prototype.dispatch = spy
    const wrapper = mount(<LogPage jogLogs={jogLogs} />)
    const rows = wrapper.find('tr')
    rows.at(1).simulate('click')
    spy.should.have.been.called()
  })

  it('should dispatch RemoveJogLogAction when remove button on a row is clicked', () => {
    const spy = chai.spy()
    RemoveJogLogAction.prototype.dispatch = spy
    const wrapper = mount(<LogPage jogLogs={jogLogs} />)
    const rows = wrapper.find('tr')
    rows.at(1).find('.glow.error-text').simulate('click')
    spy.should.have.been.called()
  })

})