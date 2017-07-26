import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'
import { mount, render } from 'enzyme'

import { Table } from './table'

const columns = [{
  name: 'Name',
  sort: true,
  sortable: true
}, {
  name: 'Value',
  alignRight: true,
  formatter: (value) => value
}]
const columns2 = [{
  name: 'Name',
  sortable: true
}, {
  name: 'Value',
  alignRight: true,
  formatter: (value) => value
}]
const columns3 = [{
  name: 'Name',
  sortable: true
}, {
  name: 'Value',
  sort: true,
  alignRight: true,
  formatter: (value) => value
}]

const rows = [
  ['Content-Type', 'application/json'],
  ['AuthType', 'Auth0']
]
const rows2 = [
  ['Content-Type', 'application/json'],
  ['Content-Type', 'Auth0'],
  ['Content-Type', 'Auth0']
]

describe('<Table/>', () => {

  it('should render a table', () => {
    const wrapper = render(<Table />)
    expect(wrapper.find('table')).to.have.length(1)
  })

  it('should render table headers with given column', () => {
    const wrapper = render(<Table columns={columns} />)
    const ths = wrapper.find('th')
    expect(ths).to.have.length(2)
    expect(ths.text()).to.contain('Name')
    expect(ths.text()).to.contain('Value')
  })

  it('should render table headers with given column and index column if specified', () => {
    const wrapper = render(<Table columns={columns} showIndex={true} />)
    const ths = wrapper.find('th')
    expect(ths).to.have.length(3)
    expect(ths.text()).to.contain('#')
    expect(ths.text()).to.contain('Name')
    expect(ths.text()).to.contain('Value')
  })

  it('should render rows with given rows', () => {
    const wrapper = render(<Table columns={columns} rows={rows} />)
    const trs = wrapper.find('tr')
    expect(trs).to.have.length(3)
    expect(trs.text()).to.contain('Content-Type')
    expect(trs.text()).to.contain('application/json')
    expect(trs.text()).to.contain('AuthType')
    expect(trs.text()).to.contain('Auth0')
  })

  it('should render rows with given rows and in sorted order', () => {
    const wrapper = mount(<Table showIndex={true} columns={columns} loading={true} />)
    wrapper.setProps({ rows, loading: false, showIndex: false })
    const trs = wrapper.find('tr')
    expect(trs).to.have.length(3)
    expect(trs.at(1).text()).to.contain('AuthType')
    expect(trs.at(1).text()).to.contain('Auth0')
    expect(trs.at(2).text()).to.contain('Content-Type')
    expect(trs.at(2).text()).to.contain('application/json')
  })

  it('should render rows with given rows and in sorted order of second column', () => {
    const wrapper = mount(<Table showIndex={true} columns={columns2} loading={true} />)
    wrapper.setProps({ rows: rows2, loading: false, showIndex: false })
    const trs = wrapper.find('tr')
    expect(trs).to.have.length(4)
    expect(trs.at(1).text()).to.contain('Content-Type')
    expect(trs.at(1).text()).to.contain('application/json')
    expect(trs.at(2).text()).to.contain('Content-Type')
    expect(trs.at(2).text()).to.contain('Auth0')
    expect(trs.at(3).text()).to.contain('Content-Type')
    expect(trs.at(3).text()).to.contain('Auth0')
  })

  it('should change sort when clicking on sortable header', () => {
    const wrapper = mount(<Table columns={columns} loading={true} />)
    wrapper.setProps({ rows, loading: false })
    const header = wrapper.find('th').at(0)
    header.simulate('click')
    const trs = wrapper.find('tr')
    expect(trs).to.have.length(3)
    expect(trs.at(1).text()).to.contain('Content-Type')
    expect(trs.at(1).text()).to.contain('application/json')
    expect(trs.at(2).text()).to.contain('AuthType')
    expect(trs.at(2).text()).to.contain('Auth0')
    header.simulate('click')
    header.simulate('click')
    const trs2 = wrapper.find('tr')
    expect(trs2).to.have.length(3)
    expect(trs2.at(1).text()).to.contain('AuthType')
    expect(trs2.at(1).text()).to.contain('Auth0')
    expect(trs2.at(2).text()).to.contain('Content-Type')
    expect(trs2.at(2).text()).to.contain('application/json')
  })

  it('should render an index column if set to true', () => {
    const wrapper = mount(<Table showIndex={true} columns={columns} rows={rows} />)
    expect(wrapper.find('th').at(0).text()).to.equal('#')
    expect(wrapper.find('tr').at(1).find('td').at(0).text()).to.equal('1')
    expect(wrapper.find('tr').at(2).find('td').at(0).text()).to.equal('2')
  })

  it('should emit an event onClickRow when row is clicked', () => {
    const onClickRow = chai.spy()
    const wrapper = mount(<Table showIndex={true}
      columns={columns} rows={rows} onClickRow={event => onClickRow()} />)
    wrapper.find('tr').at(1).simulate('click')
    onClickRow.should.have.been.called()
  })

  it('should render without error even if onClickRow is not defined', () => {
    const onClickRow = chai.spy()
    const wrapper = mount(<Table columns={columns} rows={rows} />)
    wrapper.find('tr').at(1).simulate('click')
    onClickRow.should.have.not.been.called()
  })

  it('should render without sorting if no sort is provided', () => {
    const onClickRow = chai.spy()
    const wrapper = mount(<Table columns={columns3} rows={rows} />)
    wrapper.find('tr').at(1).simulate('click')
    onClickRow.should.have.not.been.called()
  })

  it('should sort columns based on the given index', () => {
    const wrapper = mount(<Table columns={columns3} rows={rows2} />)
    wrapper.instance().sort(1, { 1: true })
    const trs = wrapper.find('tr')
    expect(trs).to.have.length(4)
    expect(trs.at(1).text()).to.contain('Content-Type')
    expect(trs.at(1).text()).to.contain('Auth0')
    expect(trs.at(2).text()).to.contain('Content-Type')
    expect(trs.at(2).text()).to.contain('Auth0')
    expect(trs.at(3).text()).to.contain('Content-Type')
    expect(trs.at(3).text()).to.contain('application/json')
  })

})
