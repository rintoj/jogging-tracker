import * as React from 'react'

import { BrowserHistory } from 'react-router-dom'
import { Loader } from '../../component'

interface Props {
  history?: BrowserHistory
}
interface State { }

export class AuthorizePage extends React.Component<Props, State> {
  render() {
    return <div className="flex flex-column items-center justify-center vh-100">
      <Loader></Loader>
    </div>
  }
}