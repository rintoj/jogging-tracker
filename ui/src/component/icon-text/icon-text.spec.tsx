import * as React from 'react'

import { chai, expect } from '../../test'

import { IconText } from './icon-text'
import { shallow } from 'enzyme'

describe('<IconText/>', () => {

  it('renders a icon-text', () => {
    const wrapper = shallow(<IconText>Sample Content</IconText>)
    expect(wrapper.text()).to.contain('Sample Content')
  })

  it('should emit onClick event when icon-text is clicked', () => {
    const onClick = chai.spy()
    const wrapper = shallow(<IconText onClick={event => onClick()}>Sample Text</IconText>)
    wrapper.find('.root-node').simulate('click')
    onClick.should.have.been.called()
  })

  it('should render without errors if onClick is not defined', () => {
    const onClick = chai.spy()
    const wrapper = shallow(<IconText >Sample Text</IconText>)
    wrapper.find('.root-node').simulate('click')
    onClick.should.have.not.been.called()
  })

})
