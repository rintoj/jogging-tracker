import * as React from 'react'

import { JogForm } from './jog-form'
import { MenuComponent } from '../menu/menu'
import { Table } from '../../component/index'

interface Props {
  history?: string[]
}
interface State { }

const columns = [
  { name: 'Date', sortable: true },
  { name: 'Distance', sortable: true, sort: false  },
  { name: 'Time', sortable: true  },
  { name: 'Average Speed', sortable: true  }
]

const rows: any[][] = [
  ['12/12/2017', 1, 4, 1.2],
  ['21/10/2008', 12, 22, 1.6],
  ['02/02/2007', 124, 4, 2.2]
]

export class HomePage extends React.Component<Props, State> {

  render() {
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