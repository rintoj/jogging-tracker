import 'jsdom-global/register'

import * as React from 'react'

import { mount, render } from 'enzyme'

import { StatisticsCard } from './statistics-card'
import { expect } from '../../test'

const statistics = require('../../test/statistics-test-data.json')

describe('<StatisticsCard/>', () => {

  it('should render overall statistics card', () => {
    const wrapper = render(<StatisticsCard type="Overall" entries={statistics.overall} />)
    expect(wrapper.find('.banner').text()).to.equal('Overall')
    expect(wrapper.find('select')).to.have.length(0)
    expect(wrapper.find('.f3').text()).to.equal('2017 Apr 26')
  })

  it('should render yearly statistics card', () => {
    const wrapper = render(<StatisticsCard type="Yearly" entries={statistics.yearly} />)
    expect(wrapper.find('.banner').text()).to.equal('Yearly')
    expect(wrapper.find('select')).to.have.length(1)
    expect(wrapper.find('option')).to.have.length(2)
    expect(wrapper.find('.f3').text()).to.equal('2016 Dec 14')
  })

  it('should render monthly statistics card', () => {
    const wrapper = render(<StatisticsCard type="Monthly" entries={statistics.monthly} />)
    expect(wrapper.find('.banner').text()).to.equal('Monthly')
    expect(wrapper.find('select')).to.have.length(1)
    expect(wrapper.find('option')).to.have.length(8)
    expect(wrapper.find('.f3').text()).to.equal('2016 Dec 14')
  })

  it('should render weekly statistics card', () => {
    const wrapper = render(<StatisticsCard type="Weekly" entries={statistics.weekly} />)
    expect(wrapper.find('.banner').text()).to.equal('Weekly')
    expect(wrapper.find('select')).to.have.length(1)
    expect(wrapper.find('option')).to.have.length(34)
    expect(wrapper.find('.f3').text()).to.equal('2016 Dec 01')
  })

  it('should switch rendering when user selects an item from the dropdown', (done) => {
    const wrapper = mount(<StatisticsCard type="Weekly" entries={statistics.weekly} />)
    expect(wrapper.find('.banner').text()).to.equal('Weekly')
    wrapper.find('select').simulate('change', { nativeEvent: { target: { selectedIndex: 2 } } })
    setTimeout(() => {
      expect(wrapper.find('.f3').text()).to.equal('2016 Dec 14')
      done()
    }, 100)
  })

  it('should render without errors if no statistics are passed', () => {
    const wrapper = mount(<StatisticsCard type="Overall" />)
    wrapper.setProps({ entries: [{}, undefined] })
    expect(wrapper.find('.banner').text()).to.equal('Overall')
  })

})