import * as React from 'react'

import { Loader } from './loader'
import { expect } from '../../test'
import { shallow } from 'enzyme'

describe('<Loader/>', () => {

  it('should render a loader', () => {
    const wrapper = shallow(<Loader></Loader>)
    expect(wrapper.find('.spinner-node')).to.have.length(4)
  })

})
