import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'
import { mount, render } from 'enzyme'

import { RegisterUserAction } from '../../action/index'
import { SignUpPage } from './signup-page'

describe('<SignUpPage/>', () => {

  it('should render with four inputs and two buttons', () => {
    const wrapper = render(<SignUpPage />)
    expect(wrapper.find('input')).to.have.length(4)
    expect(wrapper.find('button')).to.have.length(2)
  })

  it('should show error message if sign in button is pressed with invalid values', () => {
    const wrapper = mount(<SignUpPage />)
    wrapper.find('button').at(0).simulate('click')
    const errors = wrapper.find('.error-text')
    expect(errors.at(0).text()).to.equal('Required')
    expect(errors.at(1).text()).to.equal('Required')
    expect(errors.at(2).text()).to.equal('Required')
    expect(errors.at(3).text()).to.equal('Required')
  })

  it('should show an error message if id is not a valid email', (done) => {
    const wrapper = mount(<SignUpPage />)
    const inputs = wrapper.find('input')
    inputs.at(0).simulate('change', { target: { value: 'admin' } })
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => {
      const errors = wrapper.find('.error-text')
      expect(errors.at(0).text()).to.equal('Invalid email')
      done()
    })
  })

  it('should show an error message if password is not less than 6 characters in length', (done) => {
    const wrapper = mount(<SignUpPage />)
    const inputs = wrapper.find('input')
    inputs.at(2).simulate('change', { target: { value: 'admin' } })
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => {
      const errors = wrapper.find('.error-text')
      expect(errors.at(2).text()).to.equal('Password must be 6 characters in length')
      done()
    }, 100)
  })

  it('should show an error message if password does not match confirmation', (done) => {
    const wrapper = mount(<SignUpPage />)
    const inputs = wrapper.find('input')
    inputs.at(2).simulate('change', { target: { value: 'admin' } })
    inputs.at(3).simulate('change', { target: { value: 'admin1' } })
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => {
      const errors = wrapper.find('.error-text')
      expect(errors.at(3).text()).to.equal('Don\'t match!')
      done()
    }, 100)
  })

  it('should emit RegisterUserAction if form is valid and when login in button is clicked', (done) => {
    const spy = chai.spy()
    RegisterUserAction.prototype.dispatch = spy
    const wrapper = mount(<SignUpPage />)
    const inputs = wrapper.find('input')
    inputs.at(0).simulate('change', { target: { value: 'admin@system.com' } })
    inputs.at(1).simulate('change', { target: { value: 'Admin User' } })
    inputs.at(2).simulate('change', { target: { value: 'admin@123' } })
    inputs.at(3).simulate('change', { target: { value: 'admin@123' } })
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => {
      spy.should.have.been.called()
      done()
    }, 100)
  })

  it('should show an error message if login fail', (done) => {
    const spy = chai.spy(() => new Promise((resolve, reject) => {
      reject('Throw error on login')
    }))
    RegisterUserAction.prototype.dispatch = spy
    const wrapper = mount(<SignUpPage />)
    const inputs = wrapper.find('input')
    inputs.at(0).simulate('change', { target: { value: 'admin@system.com' } })
    inputs.at(1).simulate('change', { target: { value: 'Admin User' } })
    inputs.at(2).simulate('change', { target: { value: 'admin@123' } })
    inputs.at(3).simulate('change', { target: { value: 'admin@123' } })
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => {
      expect(wrapper.find('.error-text').at(0).text()).to.equal('User already exists.')
      done()
    }, 100)
  })

  it('should go to home when cancel button is clicked', (done) => {
    const history = { replace: chai.spy(), push: chai.spy() }
    const wrapper = mount(<SignUpPage history={history} />)
    wrapper.setState({ success: false })
    wrapper.find('button').at(1).simulate('click')
    setTimeout(() => {
      history.replace.should.have.been.called.with('/')
      done()
    }, 100)
  })

  it('should go to home when cancel button is clicked', (done) => {
    const history = { replace: chai.spy(), push: chai.spy() }
    const wrapper = mount(<SignUpPage history={history} />)
    wrapper.setState({ success: true })
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => {
      history.replace.should.have.been.called.with('/signin')
      done()
    }, 100)
  })

})