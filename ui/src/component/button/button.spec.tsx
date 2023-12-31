import * as React from 'react'

import { chai, expect } from '../../test'

import { Button } from './button'
import { shallow } from 'enzyme'

describe('<Button/>', () => {

  it('should render a button', () => {
    const wrapper = shallow(<Button />)
    expect(wrapper.find('button')).to.have.length(1)
  })

  it('should render the text as content', () => {
    const wrapper = shallow(<Button>Sample Text</Button>)
    expect(wrapper.text()).to.equal('Sample Text')
  })

  it('should render the button with white color', () => {
    const wrapper = shallow(<Button color="white">Sample Text</Button>)
    expect(wrapper.find('button').hasClass('white')).to.equal(true)
  })

  it('should render with disabled color if button is indeed disabled', () => {
    const wrapper = shallow(<Button color="white" disabled={true}>Sample Text</Button>)
    expect(wrapper.find('button').hasClass('divider')).to.equal(true)
  })

  it('should render with type button by default', () => {
    const wrapper = shallow(<Button>Sample Text</Button>)
    expect(wrapper.find('button').prop('type')).to.equal('button')
  })

  it('should render as a submit button if configured', () => {
    const wrapper = shallow(<Button submit={true}>Sample Text</Button>)
    expect(wrapper.find('button').prop('type')).to.equal('submit')
  })

  it('should render onClick event must be called on click', () => {
    const onClick = chai.spy()
    const wrapper = shallow(<Button onClick={event => onClick()}>Sample Text</Button>)
    wrapper.find('button').simulate('click')
    onClick.should.have.been.called()
  })

  it('should render without errors if onClick is not defined', () => {
    const onClick = chai.spy()
    const wrapper = shallow(<Button >Sample Text</Button>)
    wrapper.find('button').simulate('click')
    onClick.should.have.not.been.called()
  })

})
