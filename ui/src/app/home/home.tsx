import * as React from 'react'
import * as moment from 'moment'
import * as numeral from 'numeral'

import { FetchJogLogsAction, RemoveJogLogAction } from '../../action/index'
import { data, inject } from 'statex/react'

import { AppState } from '../../state/app-state'
import { BrowserHistory } from 'react-router-dom'
import { FilterForm } from './filter-form'
import { JogLog } from '../../state/jog-log'
import { Page } from '../page/page'
import { ShowFormAction } from '../../action/ui-actions'
import { Table } from '../../component/index'

class Props {
  history?: BrowserHistory

  @data((state: AppState) => state.requestInProgress)
  requestInProgress?: boolean

  @data((state: AppState) => state.jogLogs)
  jogLogs?: JogLog[]
}
interface State { }

const columns = [
  {
    name: 'id',
    className: 'dn'
  }, {
    name: 'Date',
    sort: false,
    sortable: true,
    alignRight: true,
    formatter: (value) => moment(value).format('MMMM DD, YYYY')
  }, {
    name: 'Distance',
    sortable: true,
    alignRight: true,
    formatter: (value) => parseFloat(value).toFixed(2) + ' km'
  }, {
    name: 'Time',
    sortable: true,
    alignRight: true,
    formatter: (value) => value == undefined ? '00:00' :
      `${numeral(value[0]).format('00')}:${numeral(value[1]).format('00')}`
  }, {
    name: 'Average Speed',
    sortable: true,
    alignRight: true,
    formatter: (value) => parseFloat(value).toFixed(2) + ' km/h'
  }, {
    name: '',
    className: 'tc w2',
    formatter: (value, rows) => <div className="w-100 ">
      <div className="fa f2 o-60 glow error-text fa-times-circle pointer" onClick={(event) => {
        event.stopPropagation()
        new RemoveJogLogAction(rows[0]).dispatch()
      }}></div>
    </div>
  }
]

@inject(Props)
export class HomePage extends React.Component<Props, State> {

  componentDidMount() {
    new FetchJogLogsAction().dispatch()
  }

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

  toJogLog(row: any[]): JogLog {
    return {
      id: row[0],
      date: row[1],
      distance: row[2],
      time: row[3],
      averageSpeed: row[4]
    }
  }

  render() {
    const rows = (this.props.jogLogs || []).map(jogLog => this.toRow(jogLog))
    return <Page history={this.props.history}>
      <div className="pa4 w-100 vh-100 overflow-y-auto">
        <div className="f2 mb4">Log Entries</div>
        <div className="flex mb4">
          <FilterForm></FilterForm>
        </div>
        <Table columns={columns} rows={rows} showIndex={true} loading={this.props.requestInProgress}
          onClickRow={row => this.editRow(row)}></Table>
      </div>
    </Page>
  }

  editRow(row: any[]) {
    new ShowFormAction(this.toJogLog(row)).dispatch()
  }

}