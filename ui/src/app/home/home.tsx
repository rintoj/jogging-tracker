import * as React from 'react'

import { MenuComponent } from '../menu/menu'

interface Props { }
interface State { }

export class HomePage extends React.Component<Props, State> {

  render() {
    return <div className="flex">
      <MenuComponent />
      Home Page
    </div>
  }
}