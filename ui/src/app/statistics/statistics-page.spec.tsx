import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'
import { mount, render } from 'enzyme'

import { FetchStatisticsAction } from '../../action/index'
import { StatisticsPage } from './statistics-page'

const statistics = require('../../test/statistics-test-data.json')

describe('<StatisticsPage/>', () => {

  it('should render without errors', () => {
    const wrapper = render(<StatisticsPage statistics={statistics} />)
    const titles = wrapper.find('.f2').text()
    expect(titles).to.contain('0.1143')
    expect(titles).to.contain('2017 Apr 26')
    expect(titles).to.contain('438.90')
    expect(titles).to.contain('322:43')
  })

  it('should show a message "No log entries" if statics is not found', () => {
    const wrapper = render(<StatisticsPage />)
    expect(wrapper.text()).to.contain('No log entries')
  })

  it('should dispatch FetchStatisticsAction on load', () => {
    const spy = chai.spy()
    FetchStatisticsAction.prototype.dispatch = spy
    mount(<StatisticsPage />)
    spy.should.have.been.called()
  })

  it('should render without issue if overall is missing', () => {
    const spy = chai.spy()
    FetchStatisticsAction.prototype.dispatch = spy
    mount(<StatisticsPage statistics={{}} />)
    spy.should.have.been.called()
  })

})