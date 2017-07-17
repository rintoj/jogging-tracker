import './style/app.scss'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { App } from './app/app'
import { BrowserRouter } from 'react-router-dom'
import { INITIAL_STATE } from './state'
import { initialize } from 'statex'

initialize(INITIAL_STATE, {
  hotLoad: process.env.NODE_ENV !== 'production',
  domain: 'jogging-tracker'
})

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>, document.getElementById('root'))
