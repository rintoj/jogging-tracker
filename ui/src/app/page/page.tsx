import * as React from 'react'

import { BrowserHistory } from 'react-router-dom'
import { Menu } from '../menu/menu'

interface Props {
  history?: BrowserHistory
}
interface State { }

export class Page extends React.Component<Props, State> {
  render() {
    return <div className="flex page-node">
      <Menu history={this.props.history} />
      <div className="flex flex-column flex-auto w-100">
        {this.props.children}
      </div>
    </div>
  }
}