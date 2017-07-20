import * as React from 'react'
import * as numeral from 'numeral'

import { data, inject } from 'statex/react'

import { AppState } from '../../state/app-state'
import { JogForm } from './jog-form'
import { JogLog } from '../../state/jog-log'
import { MenuComponent } from '../menu/menu'
import { RemoveJogLogAction } from '../../action/index'
import { Table } from '../../component/index'

class Props {
  history?: string[]

  @data((state: AppState) => state.jogLogs)
  jogLogs?: JogLog[]

  @data((state: AppState) => state.showForm)
  showForm?: boolean
}
interface State { }

const columns = [
  {
    name: 'id',
    className: 'dn'
  }, {
    name: 'Date',
    sortable: true
  }, {
    name: 'Distance',
    sortable: true,
    sort: false,
    formatter: (value) => parseFloat(value).toFixed(2) + ' km'
  }, {
    name: 'Time',
    sortable: true,
    formatter: (value) => value == undefined ? '00:00' :
      `${numeral(value[0]).format('00')}:${numeral(value[1]).format('00')}`
  }, {
    name: 'Average Speed',
    sortable: true,
    formatter: (value) => parseFloat(value).toFixed(2) + ' km/h'
  }, {
    name: '',
    className: 'tc',
    formatter: (value, rows) => <div className="w-100 ">
      <div className="fa f2 o-60 glow error-text fa-times-circle pointer" onClick={() => {
        new RemoveJogLogAction(rows[0]).dispatch()
      }}></div>
    </div>
  }
]

@inject(Props)
export class HomePage extends React.Component<Props, State> {

  toRow(jogLog: JogLog): any[] {
    return [
      jogLog.id,
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
        <div className="f2 mb4">Log Entries</div>
        {this.props.showForm && <JogForm></JogForm>}
        <Table columns={columns} rows={rows} showIndex={true}></Table>
      </div>
    </div>
  }

}