import 'jsdom-global/register'

import * as React from 'react'

import { Page } from './page'
import { expect } from '../../test'
import { render } from 'enzyme'

describe('<Page/>', () => {

  it('should render without errors', () => {
    const wrapper = render(<Page />)
    expect(wrapper.find('.page-node')).to.have.length(1)
  })

  it('should render menu', () => {
    const wrapper = render(<Page />)
    expect(wrapper.find('.menu-node')).to.have.length(1)
  })

  it('should render the given content', () => {
    const wrapper = render(<Page>
      <div className="sample-content-node">Sample Content</div>
    </Page>)
    expect(wrapper.find('.sample-content-node')).to.have.length(1)
    expect(wrapper.find('.sample-content-node').text()).to.equal('Sample Content')
  })

})