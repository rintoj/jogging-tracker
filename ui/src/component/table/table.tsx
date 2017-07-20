import * as React from 'react'

export interface Column {
  name?: string
  sort?: boolean
  sortable?: boolean
  className?: string
  formatter?: Function
}

interface Props {
  columns?: Column[]
  rows?: any[][]
  className?: string
  showIndex?: boolean
}

interface State {
  rows?: any[][]
  sorts: { [id: string]: boolean }
}

export class Table extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    // prepare sort
    let sorts = {}
    for (let i = 0; i < this.props.columns.length; i++) {
      if (this.props.columns[i].sort != undefined) {
        sorts[i] = this.props.columns[i].sort
        break
      }
    }

    // set initial state
    this.state = {
      rows: this.props.rows,
      sorts
    }
  }

  renderHeader() {
    return this.props.columns &&
      <tr className="primary">
        {this.props.showIndex && <th className={`tr primary pv4 ph4-l ph3-m ph2 ttu nowrap`}>#</th>}
        {this.props.columns.map((column, index) =>
          <th key={`h${index}`}
            onClick={() => column.sortable && this.sort(index)}
            className={`${column.className} ${column.sortable ? 'pointer' : ''} primary tr pv4 ph4-l ph3-m ph2 ttu nowrap`}>
            {column.name}
            {column.sortable && this.state.sorts[index] === true && <div className="ml2 fa fa-arrow-circle-down accent-text"></div>}
            {column.sortable && this.state.sorts[index] === false && <div className="ml2 fa fa-arrow-circle-up accent-text"></div>}
            {column.sortable && this.state.sorts[index] == undefined && <div className="ml2 fa fa-arrow-circle-down o-60"></div>}
          </th>)
        }
      </tr>
  }

  renderRecords() {
    return (this.state.rows || []).map((row, index) =>
      <tr key={index} className="striped--near-white">
        {this.props.showIndex && <td className={`tr pv4 ph4-l ph3-m ph2 ttu nowrap`}>{index + 1}</td>}
        {row.map((value, colIndex) => <td key={`${index}${colIndex}`}
          className={`tr pv4 ph4-l ph3-m ph2 ttu nowrap`}>{
            typeof this.props.columns[index].formatter === 'function' ?
              this.props.columns[index].formatter(value, row, index, this.props.columns) : value
          }</td>)}
      </tr>
    )
  }

  render() {
    return <table className={`${this.props.className} card collapse f5 tl w-100 shadow-1 br1`}>
      <tbody>
        {this.renderHeader()}
        {this.renderRecords()}
      </tbody>
    </table>
  }

  sort(index) {
    const sorts = {}
    const sort = this.state.sorts[index]
    sorts[index] = sort === true ? false : sort === false ? undefined : true

    const rows = [].concat(this.props.rows)
    if (sorts[index] != undefined) {
      rows.sort((r1, r2) => {
        let a = r1[index]
        let b = r2[index]
        return (a > b ? 1 : a < b ? -1 : 0) * (sorts[index] === true ? 1 : -1)
      })
    }
    this.setState({ sorts, rows })
  }
}