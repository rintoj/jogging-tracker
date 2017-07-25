import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'
import { mount, render } from 'enzyme'

import { SelectUserAction } from '../../action/index'
import { User } from '../../state/user'
import { UserSelector } from './user-selector'

const users: User[] = [
  { id: 'admin', name: 'Admin', authInfo: { roles: ['admin'] } },
  { id: 'manager', name: 'Manager', authInfo: { roles: ['manager'] } },
  { id: 'user', name: 'User', authInfo: { roles: ['user'] } }
]

describe('<UserSelector/>', () => {

  it('should show selected user', () => {
    const wrapper = render(<UserSelector selectedUser={users[0]} />)
    expect(wrapper.find('.w-100.flex').text()).to.contain('Admin')
  })

  it('should open user list when "Switch" button is clicked', () => {
    const wrapper = mount(<UserSelector selectedUser={users[0]} users={users} />)
    expect(wrapper.text()).not.to.contain('Select a user')
    wrapper.find('.accent-text.accent--hover').at(0).simulate('click')
    expect(wrapper.text()).to.contain('Select a user')
  })

  it('should emit SelectUserAction if a user is selected', (done) => {
    const spy = chai.spy(() => new Promise((resolve) => resolve()))
    SelectUserAction.prototype.dispatch = spy
    const wrapper = mount(<UserSelector selectedUser={users[0]} users={users} />)
    wrapper.find('.accent-text.accent--hover').at(0).simulate('click')
    wrapper.find('.profile-node').at(0).simulate('click')
    setTimeout(() => {
      spy.should.have.been.called()
      done()
    }, 100)
  })

  it('should close when dialog is closed or close button is clicked', () => {
    const wrapper = mount(<UserSelector selectedUser={users[0]} users={users} />)
    wrapper.find('.accent-text.accent--hover').at(0).simulate('click')
    wrapper.find('.accent-text.tc.pa4').simulate('click')
    expect(wrapper.text()).not.to.contain('Select a user')
  })

  it('should close when dialog is closed or close button is clicked', () => {
    const wrapper = mount(<UserSelector selectedUser={users[0]} users={users} />)
    wrapper.find('.accent-text.accent--hover').at(0).simulate('click')
    wrapper.find('.backdrop-node').simulate('click')
    expect(wrapper.text()).not.to.contain('Select a user')
  })

})