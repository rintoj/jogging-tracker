import * as React from 'react'

import { BrowserHistory } from 'react-router-dom'
import { MenuComponent } from '../menu/menu'

// import { Banner } from '../home/banner'

interface Props {
  history?: BrowserHistory
}
interface State { }

export class Page extends React.Component<Props, State> {
  render() {
    return <div className="flex w-100">
      <MenuComponent history={this.props.history} />
      <div className="flex flex-column flex-auto">
        {/* <Banner></Banner> */}
        {this.props.children}
      </div>
    </div>
  }
}