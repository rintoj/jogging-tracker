import 'jsdom-global/register'

import * as React from 'react'

import { SignInPage } from './signin';
import { expect } from '../../test'
import { render } from 'enzyme'

describe('<SignInPage/>', () => {

  it('should render with two inputs and two buttons', () => {
    const wrapper = render(<SignInPage />)
    expect(wrapper.find('input')).to.have.length(2)
    expect(wrapper.find('button')).to.have.length(2)
  })

})