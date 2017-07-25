import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'
import { mount, render } from 'enzyme'

import { ProfilePage } from './profile-page'
import { SignOutAction } from '../../action/index'
import { User } from '../../state/user'

const user: User = {
  id: 'user@user.com',
  name: 'User',
  authInfo: { roles: ['user'] }
}
const manager: User = {
  id: 'manager@user.com',
  name: 'Manager User',
  authInfo: { roles: ['manager'] }
}
const admin: User = {
  id: 'admin@user.com',
  name: 'Admin User',
  authInfo: { roles: ['admin'] }
}

describe('<Profile/>', () => {

  it('should render profile of the admin', () => {
    const wrapper = render(<ProfilePage user={admin} />)
    expect(wrapper.text()).to.contain('admin@user.com')
    expect(wrapper.text()).to.contain('Admin User')
    expect(wrapper.text()).to.contain('Administrator')
    expect(wrapper.text()).to.contain('Ad')
  })

  it('should render profile of a manager user', () => {
    const wrapper = render(<ProfilePage user={manager} />)
    expect(wrapper.text()).to.contain('manager@user.com')
    expect(wrapper.text()).to.contain('Manager User')
    expect(wrapper.text()).to.contain('Manager')
    expect(wrapper.text()).to.contain('Ma')
  })

  it('should render profile of a normal user', () => {
    const wrapper = render(<ProfilePage user={user} />)
    expect(wrapper.text()).to.contain('user@user.com')
    expect(wrapper.text()).to.contain('User')
    expect(wrapper.text()).to.contain('User')
    expect(wrapper.text()).to.contain('Us')
  })

  it('should not render profile if user is undefined', () => {
    const wrapper = render(<ProfilePage />)
    expect(wrapper.text()).not.to.contain('User')
  })

  it('should render picture as "UR" if name and picture are undefined', () => {
    const wrapper = render(<ProfilePage user={{}} />)
    expect(wrapper.text()).to.contain('UR')
  })
  it('should render picture if defined', () => {
    const wrapper = render(<ProfilePage user={{ picture: '/img.png' }} />)
    expect(wrapper.find('img')).to.have.length(1)
  })

  it('should emit SignOutAction if sign out button is clicked', async () => {
    const history = { push: chai.spy(), replace: chai.spy() }
    const spy = chai.spy()
    SignOutAction.prototype.dispatch = spy
    const wrapper = mount(<ProfilePage history={history} user={user} />)
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => spy.should.have.been.called())
  })

  it('should navigate to home screen if clicked on go home button', async () => {
    const history = { push: chai.spy(), replace: chai.spy() }
    const wrapper = mount(<ProfilePage history={history} user={user} />)
    wrapper.find('button').at(1).simulate('click')
    setTimeout(() => history.push.should.have.been.called.with('/'))
  })

})