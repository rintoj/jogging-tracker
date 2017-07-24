import 'jsdom-global/register'

import * as React from 'react'

import { LogPage } from './log'
import { expect } from '../../test'
import { render } from 'enzyme'

describe('<LogPage/>', () => {

  it('should render a page', () => {
    const wrapper = render(<LogPage />)
    expect(wrapper.find('page-node')).to.have.length(1)
  })
})