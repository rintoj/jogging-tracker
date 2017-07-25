import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'
import { mount, render } from 'enzyme'

import { SignInAction } from '../../action/index'
import { SignInPage } from './signin-page'

describe('<SignInPage/>', () => {

  it('should render with two inputs and two buttons', () => {
    const wrapper = render(<SignInPage />)
    expect(wrapper.find('input')).to.have.length(2)
    expect(wrapper.find('button')).to.have.length(2)
  })

  it('should show a loader if auth is in progress', () => {
    const wrapper = mount(<SignInPage authInProgress={true} />)
    expect(wrapper.find('.spinner-node')).to.have.length(4)
  })

  it('should show error message if sign in button is pressed with invalid values', () => {
    const wrapper = mount(<SignInPage />)
    wrapper.find('button').at(0).simulate('click')
    const errors = wrapper.find('.error-text')
    expect(errors.at(0).text()).to.equal('Required')
    expect(errors.at(1).text()).to.equal('Required')
  })

  it('should emit SignInAction if form is valid and when login in button is clicked', async () => {
    const spy = chai.spy()
    SignInAction.prototype.dispatch = spy
    const wrapper = mount(<SignInPage />)
    const inputs = wrapper.find('input')
    inputs.at(0).simulate('change', { target: { value: 'admin' } })
    inputs.at(1).simulate('change', { target: { value: 'admin' } })
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => spy.should.have.been.called(), 100)
  })

  it('should show an error message if sign in fails', async () => {
    const spy = chai.spy(() => new Promise((resolve, reject) => {
      reject('Simulated sign in failure')
    }))
    SignInAction.prototype.dispatch = spy
    const wrapper = mount(<SignInPage />)
    const inputs = wrapper.find('input')
    inputs.at(0).simulate('change', { target: { value: 'admin' } })
    inputs.at(1).simulate('change', { target: { value: 'admin' } })
    wrapper.find('button').at(0).simulate('click')
    setTimeout(() => {
      expect(wrapper.find('.error-text').at(1).text()).to.equal('Sorry, we could not authorize your email id or password')
    }, 100)
  })

  it('should go to signup page if clicked on signup', async () => {
    const history = { replace: chai.spy(), push: chai.spy() }
    const wrapper = mount(<SignInPage history={history} />)
    wrapper.find('button').at(1).simulate('click')
    history.push.should.have.been.called.with('/signup')
  })

})