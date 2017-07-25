import 'jsdom-global/register'

import * as React from 'react'

import { ShowFormAction, SignOutAction } from '../../action/index'
import { chai, expect } from '../../test'
import { mount, render } from 'enzyme'

import { Menu } from './menu'
import { User } from '../../state/user'

const admin: User = {
  name: 'Test User',
  authInfo: { roles: ['admin'] }
}
const manager: User = {
  name: 'Test User',
  authInfo: { roles: ['manager'] }
}
const user: User = {
  name: 'Test User',
  authInfo: { roles: ['user'] }
}

describe('<Menu/>', () => {

  it('should render the menu with title Jog Tracker', () => {
    const wrapper = render(<Menu />)
    expect(wrapper.find('.title-node').text()).to.equal('Jog Tracker')
  })

  it('should render the profile of the user', () => {
    const wrapper = render(<Menu user={admin} />)
    expect(wrapper.text()).to.contain('Test User')
    expect(wrapper.text()).to.contain('Administrator')
  })

  it('should emit ShowFormAction if "Make an Entry" button is clicked', () => {
    const spy = chai.spy()
    ShowFormAction.prototype.dispatch = spy
    const wrapper = mount(<Menu user={admin} />)
    wrapper.find('button').simulate('click')
    spy.should.have.been.called()
  })

  it('should emit SignOutAction and go to sign in page if Sign Out button is clicked', async () => {
    const spy = chai.spy(() => new Promise((resolve) => resolve()))
    const history = { replace: chai.spy(), push: chai.spy() }
    SignOutAction.prototype.dispatch = spy
    const wrapper = mount(<Menu user={admin} history={history} />)
    wrapper.find('.sign-out-btn').simulate('click')
    spy.should.have.been.called()
    setTimeout(() => {
      history.replace.should.have.been.called.with('/signin')
    }, 100)
  })

  it('should go to profile page if clicked on profile', async () => {
    const history = { replace: chai.spy(), push: chai.spy() }
    const wrapper = mount(<Menu user={manager} history={history} />)
    wrapper.find('.profile-node').simulate('click')
    history.push.should.have.been.called.with('/profile')
  })

  it('should go to statistics page if statics icon is clicked', async () => {
    const history = { replace: chai.spy(), push: chai.spy() }
    const wrapper = mount(<Menu user={manager} history={history} />)
    wrapper.find('.statistics-node').simulate('click')
    history.push.should.have.been.called.with('/statistics')
  })

  it('should go to log entries page if log entries icon is clicked', async () => {
    const history = { replace: chai.spy(), push: chai.spy() }
    const wrapper = mount(<Menu user={manager} history={history} />)
    wrapper.find('.log-entries-node').simulate('click')
    history.push.should.have.been.called.with('/logs')
  })

  it('should go to users page if manager users icon is clicked as admin', async () => {
    const history = { replace: chai.spy(), push: chai.spy() }
    const wrapper = mount(<Menu user={admin} history={history} />)
    wrapper.find('.manage-users-node').simulate('click')
    history.push.should.have.been.called.with('/users')
  })

  it('should go to users page if manager users icon is clicked as manager', async () => {
    const history = { replace: chai.spy(), push: chai.spy() }
    const wrapper = mount(<Menu user={manager} history={history} />)
    wrapper.find('.manage-users-node').simulate('click')
    history.push.should.have.been.called.with('/users')
  })

  it('should NOT show manage users link for users other than admin and manager', async () => {
    const history = { replace: chai.spy(), push: chai.spy() }
    const wrapper = mount(<Menu user={user} history={history} />)
    expect(wrapper.find('.manage-users-node')).to.have.length(0)
  })

  it('should show switch user for admin', async () => {
    const history = { replace: chai.spy(), push: chai.spy() }
    const wrapper = mount(<Menu user={admin} history={history} />)
    expect(wrapper.find('.user-selector-node')).to.have.length(1)
  })

  it('should NOT show switch user for managers', async () => {
    const history = { replace: chai.spy(), push: chai.spy() }
    const wrapper = mount(<Menu user={manager} history={history} />)
    expect(wrapper.find('.user-selector-node')).to.have.length(0)
  })

  it('should NOT show switch user for users', async () => {
    const history = { replace: chai.spy(), push: chai.spy() }
    const wrapper = mount(<Menu user={user} history={history} />)
    expect(wrapper.find('.user-selector-node')).to.have.length(0)
  })

})