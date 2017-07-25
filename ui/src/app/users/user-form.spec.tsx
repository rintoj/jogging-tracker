import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'
import { mount, render } from 'enzyme'

import { SaveUserAction } from '../../action/index'
import { User } from '../../state/user'
import { UserForm } from './user-form'

const user: User = { id: 'user@user.com', name: 'User', authInfo: { roles: ['admin'] } }

describe('<UserForm/>', () => {

  it('should render with three inputs fields', () => {
    const wrapper = render(<UserForm />)
    expect(wrapper.find('input')).to.have.length(3)
  })

  it('should show error messages if create button is created with empty fields', () => {
    const wrapper = mount(<UserForm />)
    wrapper.find('button').at(0).simulate('click')
    const errors = wrapper.find('.error-text')
    expect(errors).to.have.length(3)
    expect(errors.at(0).text()).to.equal('Required')
    expect(errors.at(1).text()).to.equal('Required')
  })

  it('should show error messages if id is not a valid email', () => {
    const wrapper = mount(<UserForm />)
    wrapper.find('input').at(0).simulate('change', { target: { value: 'test' } })
    wrapper.find('button').at(0).simulate('click')
    const errors = wrapper.find('.error-text')
    expect(errors).to.have.length(3)
    expect(errors.at(0).text()).to.equal('Invalid email')
  })

  it('should show an error messages if password is not 6 characters in length', () => {
    const wrapper = mount(<UserForm />)
    wrapper.find('input').at(2).simulate('change', { target: { value: 'test' } })
    wrapper.find('button').at(0).simulate('click')
    const errors = wrapper.find('.error-text')
    expect(errors).to.have.length(3)
    expect(errors.at(2).text()).to.equal('Password must be 6 characters in length')
  })

  it('should emit SaveUserAction when form is valid and create button is clicked', (done) => {
    const spy = chai.spy(() => new Promise((resolve) => resolve()))
    SaveUserAction.prototype.dispatch = spy
    const wrapper = mount(<UserForm onClose={() => undefined} />)
    const inputs = wrapper.find('input')
    inputs.at(0).simulate('change', { target: { value: 'test@user.com' } })
    inputs.at(1).simulate('change', { target: { value: 'Sample user' } })
    inputs.at(2).simulate('change', { target: { value: 'password@123' } })
    wrapper.find('select').at(0).simulate('change', { target: { selectedIndex: 1 } })
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => {
      spy.should.have.been.called()
      done()
    })
  })

  it('should show an error message when create a new user fails', (done) => {
    const spy = chai.spy(() => new Promise((resolve, reject) => reject()))
    SaveUserAction.prototype.dispatch = spy
    const wrapper = mount(<UserForm />)
    const inputs = wrapper.find('input')
    inputs.at(0).simulate('change', { target: { value: 'test@user.com' } })
    inputs.at(1).simulate('change', { target: { value: 'Sample user' } })
    inputs.at(2).simulate('change', { target: { value: 'password@123' } })
    wrapper.find('select').at(0).simulate('change', { target: { selectedIndex: 1 } })
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => {
      spy.should.have.been.called()
      expect(wrapper.find('.error-text').at(0).text()).to.equal('User already exists.')
      done()
    }, 500)
  })

  it('should show an error message when save fails', (done) => {
    const spy = chai.spy(() => new Promise((resolve, reject) => reject()))
    SaveUserAction.prototype.dispatch = spy
    const wrapper = mount(<UserForm user={user} />)
    const inputs = wrapper.find('input')
    inputs.at(0).simulate('change', { target: { value: 'test@user.com' } })
    inputs.at(1).simulate('change', { target: { value: 'Sample user' } })
    inputs.at(2).simulate('change', { target: { value: 'password@123' } })
    wrapper.find('select').at(0).simulate('click', { stopPropagation: () => undefined })
    wrapper.find('select').at(0).simulate('change', { target: { selectedIndex: 1 } })
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => {
      spy.should.have.been.called()
      expect(wrapper.find('.error-text').at(0).text()).to.equal('Failed! Try again')
      done()
    }, 500)
  })

  it('should change the title to update user if user is defined', () => {
    const wrapper = mount(<UserForm user={user} />)
    expect(wrapper.text()).to.contain('Update user')
  })

  it('should close when dialog is closed', () => {
    const spy = chai.spy()
    const wrapper = mount(<UserForm onClose={spy} />)
    wrapper.setProps({ user })
    wrapper.find('.backdrop-node').simulate('click')
    spy.should.have.been.called()
  })

  it('should close when close button is clicked', () => {
    const spy = chai.spy()
    const wrapper = mount(<UserForm user={user} onClose={spy} />)
    wrapper.find('button').at(1).simulate('click')
    spy.should.have.been.called()
  })

  it('should works fine even if on close event is not defined', () => {
    const spy = chai.spy()
    const wrapper = mount(<UserForm user={user} />)
    wrapper.find('button').at(1).simulate('click')
    spy.should.not.have.been.called()
  })

})