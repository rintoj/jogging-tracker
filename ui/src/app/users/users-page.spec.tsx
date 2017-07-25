import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'
import { mount, render } from 'enzyme'

import { RemoveUserAction } from '../../action/index'
import { User } from '../../state/user'
import { UsersPage } from './users-page'

const users: User[] = [
  { id: 'admin@system.com', name: 'Admin', authInfo: { roles: ['admin'] } },
  { id: 'manager@system.com', name: 'Manager', authInfo: { roles: ['manager'] } },
  { id: 'user@system.com', name: 'User', authInfo: { roles: ['user'] } }
]

describe('<UsersPage/>', () => {

  it('should render a user table', () => {
    const wrapper = render(<UsersPage users={users} />)
    expect(wrapper.find('table')).to.have.length(1)
  })
  it('should render a user per row', () => {
    const wrapper = mount(<UsersPage users={users} />)
    const rows = wrapper.find('tr')
    expect(rows).to.have.length(4)
    let columns = rows.at(1).find('td')
    expect(columns.at(0).text()).to.have.equal('1')
    expect(columns.at(1).text()).to.have.equal('AdAdmin')
    expect(columns.at(2).text()).to.have.equal('admin@system.com')
    expect(columns.at(3).text()).to.have.equal('admin')

    columns = rows.at(2).find('td')
    expect(columns.at(0).text()).to.have.equal('2')
    expect(columns.at(1).text()).to.have.equal('MaManager')
    expect(columns.at(2).text()).to.have.equal('manager@system.com')
    expect(columns.at(3).text()).to.have.equal('manager')

    columns = rows.at(3).find('td')
    expect(columns.at(0).text()).to.have.equal('3')
    expect(columns.at(1).text()).to.have.equal('UsUser')
    expect(columns.at(2).text()).to.have.equal('user@system.com')
    expect(columns.at(3).text()).to.have.equal('user')
  })

  it('should show user form when a row is clicked', () => {
    const wrapper = mount(<UsersPage users={users} />)
    const rows = wrapper.find('tr')
    expect(wrapper.text()).not.to.contain('Update user')
    rows.at(1).simulate('click')
    expect(wrapper.text()).to.contain('Update user')
  })

  it('should show user form when create user button is clicked', () => {
    const wrapper = mount(<UsersPage users={users} />)
    expect(wrapper.text()).not.to.contain('Create a user')
    wrapper.find('button').at(1).simulate('click')
    expect(wrapper.text()).to.contain('Create a user')
  })

  it('should filtered users when a search text is entered and should ignore case', () => {
    const wrapper = mount(<UsersPage users={users} />)
    wrapper.find('input').simulate('change', { target: { value: 'aDmin' } })
    const rows = wrapper.find('tr')
    expect(rows).to.have.length(2)
    let columns = rows.at(1).find('td')
    expect(columns.at(0).text()).to.have.equal('1')
    expect(columns.at(1).text()).to.have.equal('AdAdmin')
    expect(columns.at(2).text()).to.have.equal('admin@system.com')
    expect(columns.at(3).text()).to.have.equal('admin')
  })

  it('should show no records if users are not found', () => {
    const wrapper = mount(<UsersPage />)
    const rows = wrapper.find('tr')
    expect(rows).to.have.length(2)
    let columns = rows.at(1).find('td')
    expect(columns.at(0).text()).to.have.equal('No Records')
  })

  it('should dispatch RemoveUserAction when remove button on a row is clicked', () => {
    const spy = chai.spy()
    RemoveUserAction.prototype.dispatch = spy
    const wrapper = mount(<UsersPage users={users} />)
    const rows = wrapper.find('tr')
    rows.at(1).find('.glow.error-text').simulate('click')
    spy.should.have.been.called()
  })

  it('should close the form when clicked on backdrop', () => {
    const wrapper = mount(<UsersPage users={users} />)
    wrapper.find('button').at(1).simulate('click')
    expect(wrapper.text()).to.contain('Create a user')
    wrapper.find('.backdrop-node').simulate('click')
    expect(wrapper.text()).not.to.contain('Create a user')
  })

})