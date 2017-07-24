import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'
import { mount, shallow } from 'enzyme'

import { Profile } from './profile'

describe('<Profile/>', () => {

  it('renders a profile with a name', () => {
    const wrapper = shallow(<Profile name="User" />)
    expect(wrapper.text()).to.contain('User')
  })

  it('renders a profile with a picture', () => {
    const wrapper = shallow(<Profile picture="//img/test.png" />)
    expect(wrapper.find('img')).to.have.length(1)
  })

  it('renders a profile with the given role as user', () => {
    const wrapper = shallow(<Profile roles={['user']} />)
    expect(wrapper.text()).to.contain('User')
  })

  it('renders a profile with the given role as manager', () => {
    const wrapper = shallow(<Profile roles={['manager']} />)
    expect(wrapper.text()).to.contain('Manager')
  })

  it('renders a profile with the given role as admin', () => {
    const wrapper = shallow(<Profile roles={['admin']} />)
    expect(wrapper.text()).to.contain('Administrator')
  })

  it('render onProfileClick event must be called on click', () => {
    const onProfileClick = chai.spy()
    const wrapper = shallow(<Profile onProfileClick={event => onProfileClick()}></Profile>)
    wrapper.find('.profile-node').simulate('click')
    onProfileClick.should.have.been.called()
  })

  it('render without errors if onProfileClick is not defined', () => {
    const onProfileClick = chai.spy()
    const wrapper = shallow(<Profile ></Profile>)
    wrapper.find('.profile-node').simulate('click')
    onProfileClick.should.have.not.been.called()
  })

  it('render onButtonClick event must be called on click', () => {
    const onButtonClick = chai.spy()
    const wrapper = mount(<Profile showButton={true} onButtonClick={event => onButtonClick()}></Profile>)
    wrapper.find('.sign-out-btn').simulate('click')
    onButtonClick.should.have.been.called()
  })

  it('render without errors if onButtonClick is not defined', () => {
    const onButtonClick = chai.spy()
    const wrapper = mount(<Profile showButton={true} />)
    wrapper.find('.sign-out-btn').simulate('click')
    onButtonClick.should.have.not.been.called()
  })

})
