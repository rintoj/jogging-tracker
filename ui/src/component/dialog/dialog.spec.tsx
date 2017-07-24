import * as React from 'react'

import { chai, expect } from '../../test'

import { Dialog } from './dialog'
import { shallow } from 'enzyme'

describe('<Dialog/>', () => {

  it('should render a dialog', () => {
    const wrapper = shallow(<Dialog>Sample Content</Dialog>)
    expect(wrapper.text()).to.contain('Sample Content')
  })

  it('should emit onClose event when dialog is closed', () => {
    const onClose = chai.spy()
    const wrapper = shallow(<Dialog onClose={event => onClose()}>Sample Text</Dialog>)
    wrapper.find('.backdrop-node').simulate('click')
    onClose.should.have.been.called()
  })

  it('should render without errors if onClose is not defined', () => {
    const onClose = chai.spy()
    const wrapper = shallow(<Dialog >Sample Text</Dialog>)
    wrapper.find('.backdrop-node').simulate('click')
    onClose.should.have.not.been.called()
  })

})
