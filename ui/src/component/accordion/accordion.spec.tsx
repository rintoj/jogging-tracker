import 'jsdom-global/register'

import * as React from 'react'

import { chai, expect } from '../../test'
import { mount, render } from 'enzyme'

import { Accordion } from './accordion'

describe('<Accordion/>', () => {

  it('should render with a the given title', () => {
    const wrapper = render(<Accordion title="Test" />)
    expect(wrapper.find('.pointer.ttu.mr3').text()).to.equal('Test')
  })

  it('should render the content when open', () => {
    const wrapper = render(<Accordion title="Test" open={true}>
      <div className="container">Test Content</div>
    </Accordion>)
    expect(wrapper.find('.container').text()).to.equal('Test Content')
  })

  it('should show a badge when not open', () => {
    const wrapper = render(<Accordion title="Test" open={false} badge="Test Badge"></Accordion>)
    expect(wrapper.find('.accent-text.ml3.br3.ttu').text()).to.contain('Test Badge')
  })

  it('should hide the badge when open', () => {
    const wrapper = render(<Accordion title="Test" open={true} badge="Test Badge"></Accordion>)
    expect(wrapper.find('.accent-text.ml3.br3.ttu').text()).not.to.contain('Test Badge')
  })

  it('should call onToggle when open or close', () => {
    const onToggle = chai.spy()
    const wrapper = mount(<Accordion title="Test" onToggle={event => onToggle()}></Accordion>)
    wrapper.find('.flex.items-center.pointer.root').simulate('click')
    onToggle.should.have.been.called()
  })

  it('should open or close without errors if onToggle is not defined', () => {
    const onToggle = chai.spy()
    const wrapper = mount(<Accordion title="Test"></Accordion>)
    wrapper.find('.flex.items-center.pointer.root').simulate('click')
    onToggle.should.have.not.been.called()
  })

  it('should call onBadgeClick when clicking on badge', () => {
    const onBadgeClick = chai.spy()
    const wrapper = mount(<Accordion title="Test" badge="Test" onBadgeClick={event => onBadgeClick()}></Accordion>)
    wrapper.find('.badge-node.accent-text').simulate('click')
    onBadgeClick.should.have.been.called()
  })

  it('should work without errors if onBadgeClick is not defined', () => {
    const onBadgeClick = chai.spy()
    const wrapper = mount(<Accordion title="Test" badge="Test"></Accordion>)
    wrapper.find('.badge-node.accent-text').simulate('click')
    onBadgeClick.should.have.not.been.called()
  })

})