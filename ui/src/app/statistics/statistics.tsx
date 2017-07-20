import * as React from 'react'

import { data, inject } from 'statex/react'

import { AppState } from '../../state'
import { MenuComponent } from '../menu/menu'

class Props {
  history?: string[]

  @data((state: AppState) => state.jogLogs.length)
  total: number
}

interface State { }

@inject(Props)
export class StatisticsPage extends React.Component<Props, State> {

  render() {
    return <div className="flex">
      <MenuComponent history={this.props.history} />
      <div className="flex flex-column pa4 w-100">
        <div className="f2 mb4">Log Entries</div>
        <div className="f2">{this.props.total}</div>
      </div>
    </div>
  }
}