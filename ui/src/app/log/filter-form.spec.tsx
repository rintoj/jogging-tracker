import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'

import { FetchJogLogsAction } from '../../action/index'
import { FilterForm } from './filter-form'
import { mount } from 'enzyme'

const filters = {
  fromDate: '2017-12-12',
  toDate: '2017-12-13'
}
const invalidFilters = {
  toDate: '2017-12-12',
  fromDate: '2017-12-13'
}

describe('<FilterForm/>', () => {

  it('should render the form', () => {
    const wrapper = mount(<FilterForm />)
    const inputs = wrapper.find('input')
    expect(inputs).to.have.length(0)
  })

  it('should render the form with two date inputs when open', () => {
    const wrapper = mount(<FilterForm open={true} />)
    const inputs = wrapper.find('input')
    expect(inputs).to.have.length(2)
    expect(inputs.at(0).prop('type')).to.equal('date')
    expect(inputs.at(1).prop('type')).to.equal('date')
  })

  it('should set the value as defined by filter', () => {
    const wrapper = mount(<FilterForm open={true} filters={filters} />)
    const inputs = wrapper.find('input')
    expect(inputs).to.have.length(2)
    expect(inputs.at(0).prop('value')).to.equal('2017-12-12')
    expect(inputs.at(1).prop('value')).to.equal('2017-12-13')
  })

  it('should set the value as defined by filter at run time', () => {
    const wrapper = mount(<FilterForm open={true} />)
    wrapper.setProps({ filters })
    const inputs = wrapper.find('input')
    expect(inputs).to.have.length(2)
    expect(inputs.at(0).prop('value')).to.equal('2017-12-12')
    expect(inputs.at(1).prop('value')).to.equal('2017-12-13')
  })

  it('should NOT emit FetchJogLogsAction action if from date is greater than to date', () => {
    const spy = chai.spy()
    const wrapper = mount(<FilterForm open={true} />)
    wrapper.setProps({ filters: invalidFilters })
    const inputs = wrapper.find('input')
    FetchJogLogsAction.prototype.dispatch = spy
    inputs.at(1).simulate('change')
    spy.should.not.have.been.called()
  })

  it('should emit FetchJogLogsAction action when a value is changed', () => {
    const spy = chai.spy()
    const wrapper = mount(<FilterForm open={true} filters={filters} />)
    const inputs = wrapper.find('input')
    expect(inputs).to.have.length(2)
    FetchJogLogsAction.prototype.dispatch = spy
    inputs.at(0).simulate('change', { target: { value: '' } })
    inputs.at(1).simulate('change')
    spy.should.have.been.called()
  })

  it('should clear filters if badge "clear filters" is clicked', () => {
    const spy = chai.spy()
    const wrapper = mount(<FilterForm open={false} filters={filters} />)
    FetchJogLogsAction.prototype.dispatch = spy
    wrapper.find('.badge-node').simulate('click')
    spy.should.have.been.called()
  })

  it('should render without error even if filters are not passed', () => {
    const wrapper = mount(<FilterForm />)
    wrapper.setState({ open: false })
  })

})
