import * as React from 'react'

import { Button } from './button'
import { expect } from '../../test'
import { shallow } from 'enzyme'

describe('<Button />', () => {

  it('renders a button', () => {
    const wrapper = shallow(<Button />)
    expect(wrapper.find('button')).to.have.length(1)
  })

  it('renders the text as content', () => {
    const wrapper = shallow(<Button>Sample Text</Button>)
    expect(wrapper.text()).to.equal('Sample Text')
  })

  it('render the button with white color', () => {
    const wrapper = shallow(<Button color="white">Sample Text</Button>)
    expect(wrapper.find('button').hasClass('white')).to.equal(true)
  })

  it('render with disabled color if button is indeed disabled', () => {
    const wrapper = shallow(<Button color="white" disabled={true}>Sample Text</Button>)
    expect(wrapper.find('button').hasClass('divider')).to.equal(true)
  })

})
