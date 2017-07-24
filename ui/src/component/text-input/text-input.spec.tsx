import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'
import { mount, shallow } from 'enzyme'

import { TextInput } from './text-input'

describe('<TextInput/>', () => {

  it('renders a text-input', () => {
    const wrapper = shallow(<TextInput />)
    expect(wrapper.find('input')).to.have.length(1)
  })

  it('renders a text-input of type password', () => {
    const wrapper = shallow(<TextInput type="password" />)
    expect(wrapper.find('input').prop('type')).to.equal('password')
  })

  it('renders a text-input of type number', () => {
    const wrapper = shallow(<TextInput type="number" />)
    expect(wrapper.find('input').prop('type')).to.equal('number')
  })

  it('renders a text-input of type date', () => {
    const wrapper = shallow(<TextInput type="date" />)
    expect(wrapper.find('input').prop('type')).to.equal('date')
  })

  it('renders a text-input of type time', () => {
    const wrapper = shallow(<TextInput type="time" />)
    expect(wrapper.find('input').prop('type')).to.equal('time')
  })

  it('renders a text-input of type color', () => {
    const wrapper = shallow(<TextInput type="color" />)
    expect(wrapper.find('input').prop('type')).to.equal('color')
  })

  it('renders a text-input with a white background color', () => {
    const wrapper = shallow(<TextInput />)
    expect(wrapper.find('input').hasClass('white')).to.equal(true)
  })

  it('renders a text-input with a gray background color if disabled', () => {
    const wrapper = shallow(<TextInput disabled={true} />)
    expect(wrapper.find('input').hasClass('divider')).to.equal(true)
  })

  it('renders with gray background if disabled', () => {
    const wrapper = shallow(<TextInput disabled={true} />)
    const inputs = wrapper.find('input')
    expect(inputs.hasClass('divider')).to.equal(true)
  })

  it('renders with error message if specified', () => {
    const wrapper = shallow(<TextInput error={'Test message'} />)
    const inputs = wrapper.find('.error-text')
    expect(inputs.text()).to.equal('Test message')
  })

  it('renders with red border if there is an error', () => {
    const wrapper = shallow(<TextInput error={'test'} />)
    const inputs = wrapper.find('input')
    expect(inputs.hasClass('error-br')).to.equal(true)
  })

  it('should emit an event onChange when text value changes', () => {
    const onChange = chai.spy()
    const wrapper = mount(<TextInput onChange={event => onChange()} />)
    wrapper.find('input').simulate('change')
    onChange.should.have.been.called()
  })

  it('renders without error even if onChange is not defined', () => {
    const onChange = chai.spy()
    const wrapper = mount(<TextInput />)
    wrapper.find('input').simulate('change')
    onChange.should.have.not.been.called()
  })

  it('should emit an event onFocus when focus change', () => {
    const onFocus = chai.spy()
    const wrapper = mount(<TextInput onFocus={event => onFocus()} />)
    wrapper.find('input').simulate('focus')
    onFocus.should.have.been.called()
  })

  it('renders without error even if onFocus is not defined', () => {
    const onFocus = chai.spy()
    const wrapper = mount(<TextInput />)
    wrapper.find('input').simulate('focus')
    onFocus.should.have.not.been.called()
  })

  it('should emit an event onBlur when blur change', () => {
    const onBlur = chai.spy()
    const wrapper = mount(<TextInput onBlur={event => onBlur()} />)
    wrapper.find('input').simulate('blur')
    onBlur.should.have.been.called()
  })

  it('renders without error even if onBlur is not defined', () => {
    const onBlur = chai.spy()
    const wrapper = mount(<TextInput />)
    wrapper.find('input').simulate('blur')
    onBlur.should.have.not.been.called()
  })

})
