import * as React from 'react'

import { MenuComponent } from '../menu/menu'

interface Props {
  history?: string[]
}
interface State { }

export class HomePage extends React.Component<Props, State> {

  render() {
    return <div className="flex">
      <MenuComponent history={this.props.history} />
      Home Page
    </div>
  }
}