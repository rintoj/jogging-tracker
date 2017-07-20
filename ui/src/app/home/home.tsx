import * as React from 'react'

import { data, inject } from 'statex/react'

import { AppState } from '../../state/app-state'
import { JogForm } from './jog-form'
import { JogLog } from '../../state/jog-log'
import { MenuComponent } from '../menu/menu'
import { Table } from '../../component/index'

class Props {
  history?: string[]

  @data((state: AppState) => state.jogLogs)
  jogLogs?: JogLog[]
}
interface State { }

const columns = [
  {
    name: 'Date',
    sortable: true
  }, {
    name: 'Distance',
    sortable: true,
    sort: false
  }, {
    name: 'Time',
    sortable: true,
    formatter: (value) => value == undefined ? '0:0' : `${value[0]}:${value[1]}`
  }, {
    name: 'Average Speed',
    sortable: true,
    formatter: (value) => parseFloat(value).toFixed(2) + ' km/h'
  }, {
    name: 'Actions',
    formatter: () => <div className="fa fa-close pointer"></div>
  }
]

@inject(Props)
export class HomePage extends React.Component<Props, State> {

  toRow(jogLog: JogLog): any[] {
    return [
      jogLog.date,
      jogLog.distance,
      jogLog.time,
      jogLog.averageSpeed,
      ''
    ]
  }

  render() {
    const rows = (this.props.jogLogs || []).map(jogLog => this.toRow(jogLog))
    return <div className="flex">
      <MenuComponent history={this.props.history} />
      <div className="flex flex-column pa4 w-100">
        Home Page
        <JogForm></JogForm>
        <Table columns={columns} rows={rows} showIndex={true}></Table>
      </div>
    </div>
  }

}