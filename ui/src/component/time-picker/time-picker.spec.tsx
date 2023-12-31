import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'
import { mount, shallow } from 'enzyme'

import { TimePicker } from './time-picker'

describe('<TextInput/>', () => {

  it('should render two numeric inputs', () => {
    const wrapper = shallow(<TimePicker />)
    const inputs = wrapper.find('input')
    expect(inputs).to.have.length(2)
    expect(inputs.at(0).prop('type')).to.equal('number')
    expect(inputs.at(1).prop('type')).to.equal('number')
  })

  it('should render with white background', () => {
    const wrapper = shallow(<TimePicker />)
    const inputs = wrapper.find('.root-node')
    expect(inputs.hasClass('white')).to.equal(true)
  })

  it('should render with gray background if disabled', () => {
    const wrapper = shallow(<TimePicker disabled={true} />)
    const inputs = wrapper.find('.root-node')
    expect(inputs.hasClass('divider')).to.equal(true)
  })

  it('should render with error message if specified', () => {
    const wrapper = shallow(<TimePicker error={'Test message'} />)
    const inputs = wrapper.find('.error-text')
    expect(inputs.text()).to.equal('Test message')
  })

  it('should render with red border if there is an error', () => {
    const wrapper = shallow(<TimePicker error={'test'} />)
    const inputs = wrapper.find('.root-node')
    expect(inputs.hasClass('error-br')).to.equal(true)
  })

  it('should emit an event onChange when hour value changes', () => {
    const onChange = chai.spy()
    const wrapper = mount(<TimePicker onChange={event => onChange()} />)
    wrapper.find('input').at(0).simulate('change')
    onChange.should.have.been.called()
  })

  it('should emit an event onChange when minute value changes', () => {
    const onChange = chai.spy()
    const wrapper = mount(<TimePicker onChange={event => onChange()} />)
    wrapper.find('input').at(1).simulate('change')
    onChange.should.have.been.called()
  })

  it('should call onChange even when user delete the content', () => {
    const onChange = chai.spy()
    const wrapper = mount(<TimePicker onChange={event => onChange()} />)
    wrapper.find('input').at(1).simulate('change', { target: { value: '' } })
    onChange.should.have.been.called()
  })

  it('should render without error even if onChange is not defined', () => {
    const onChange = chai.spy()
    const wrapper = mount(<TimePicker />)
    wrapper.find('input').at(0).simulate('change')
    onChange.should.have.not.been.called()
  })

  it('should emit an event onFocus when hour focus change', () => {
    const onFocus = chai.spy()
    const wrapper = mount(<TimePicker onFocus={event => onFocus()} />)
    wrapper.find('input').at(0).simulate('focus')
    onFocus.should.have.been.called()
  })

  it('should emit an event onFocus when minute focus change', () => {
    const onFocus = chai.spy()
    const wrapper = mount(<TimePicker onFocus={event => onFocus()} />)
    wrapper.find('input').at(1).simulate('focus')
    onFocus.should.have.been.called()
  })

  it('should render without error even if onFocus is not defined', () => {
    const onFocus = chai.spy()
    const wrapper = mount(<TimePicker />)
    wrapper.find('input').at(0).simulate('focus')
    onFocus.should.have.not.been.called()
  })

  it('should emit an event onBlur when hour blur change', () => {
    const onBlur = chai.spy()
    const wrapper = mount(<TimePicker onBlur={event => onBlur()} />)
    wrapper.find('input').at(0).simulate('blur')
    onBlur.should.have.been.called()
  })

  it('should emit an event onBlur when minute blur change', () => {
    const onBlur = chai.spy()
    const wrapper = mount(<TimePicker onBlur={event => onBlur()} />)
    wrapper.find('input').at(1).simulate('blur')
    onBlur.should.have.been.called()
  })

  it('should render without error even if onBlur is not defined', () => {
    const onBlur = chai.spy()
    const wrapper = mount(<TimePicker />)
    wrapper.find('input').at(0).simulate('blur')
    onBlur.should.have.not.been.called()
  })

})
