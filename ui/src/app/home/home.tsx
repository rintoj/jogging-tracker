import * as React from 'react'

import { JogForm } from './jog-form'
import { MenuComponent } from '../menu/menu'

interface Props {
  history?: string[]
}
interface State { }

export class HomePage extends React.Component<Props, State> {

  render() {
    return <div className="flex">
      <MenuComponent history={this.props.history} />
      <div className="flex flex-column pa4 w-100">
        Home Page
        <JogForm></JogForm>
      </div>
    </div>
  }
}