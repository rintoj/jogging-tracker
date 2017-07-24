import 'jsdom-global/register'

import * as React from 'react'

import { mount, render } from 'enzyme'

import { Table } from './table'
import { expect } from '../../test'

const columns = [{
  name: 'Name',
  sort: true,
  sortable: true
}, {
  name: 'Value'
}]

const rows = [
  ['Content-Type', 'application/json'],
  ['AuthType', 'Auth0']
]

describe('<Table/>', () => {

  it('renders a table', () => {
    const wrapper = render(<Table />)
    expect(wrapper.find('table')).to.have.length(1)
  })

  it('renders table headers with given column', () => {
    const wrapper = render(<Table columns={columns} />)
    const ths = wrapper.find('th')
    expect(ths).to.have.length(2)
    expect(ths.text()).to.contain('Name')
    expect(ths.text()).to.contain('Value')
  })

  it('renders rows with given rows', () => {
    const wrapper = render(<Table columns={columns} rows={rows} />)
    const trs = wrapper.find('tr')
    expect(trs).to.have.length(3)
    expect(trs.text()).to.contain('Content-Type')
    expect(trs.text()).to.contain('application/json')
    expect(trs.text()).to.contain('AuthType')
    expect(trs.text()).to.contain('Auth0')
  })

  it('renders rows with given rows and in sorted order', () => {
    const wrapper = mount(<Table columns={columns} loading={true} />)
    wrapper.setProps({ rows, loading: false })
    const trs = wrapper.find('tr')
    expect(trs).to.have.length(3)
    expect(trs.at(1).text()).to.contain('AuthType')
    expect(trs.at(1).text()).to.contain('Auth0')
    expect(trs.at(2).text()).to.contain('Content-Type')
    expect(trs.at(2).text()).to.contain('application/json')
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

})
