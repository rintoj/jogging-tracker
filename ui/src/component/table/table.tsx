import * as React from 'react'

import { Loader } from '../index'

export interface Column {
  name?: string
  sort?: boolean
  sortable?: boolean
  className?: string
  formatter?: Function
  alignRight?: boolean
}

interface Props {
  columns?: Column[]
  rows?: any[][]
  className?: string
  showIndex?: boolean
  loading?: boolean
  onClickRow?: Function
}

interface State {
  rows?: any[][]
  sorts: { [id: string]: boolean }
}

export class Table extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      sorts: {}
    }
  }

  componentWillReceiveProps(props) {
    this.props = props
    let sorts = {}
    for (let i = 0; i < this.props.columns.length; i++) {
      if (this.props.columns[i].sort != undefined) {
        sorts[i] = this.props.columns[i].sort
        break
      }
    }
    this.setState({ rows: props.rows, sorts })

    let sortIndex = Object.keys(sorts)[0]
    if (sortIndex != undefined) {
      this.sort(sortIndex, sorts)
    }
  }

  renderHeader() {
    return this.props.columns &&
      <tr className="primary">
        {this.props.showIndex && <th className={`tr primary pv4 ph4-l ph3-m ph2 ttu nowrap`}>#</th>}
        {this.props.columns.map((column, index) => {
          const alignment = column.alignRight ? 'tr' : 'tl'
          return < th key={`h${index}`}
            onClick={() => column.sortable && this.toggleSort(index)}
            className={`${column.className} ${column.sortable ? 'pointer' : ''} primary ${alignment} pv4 ph4-l ph3-m ph2 ttu nowrap`}>
            {column.name}
            {column.sortable && this.state.sorts[index] === true && <div className="ml2 fa fa-arrow-circle-down accent-text"></div>}
            {column.sortable && this.state.sorts[index] === false && <div className="ml2 fa fa-arrow-circle-up accent-text"></div>}
            {column.sortable && this.state.sorts[index] == undefined && <div className="ml2 fa fa-arrow-circle-down o-60"></div>}
          </th>
        })
        }
      </tr>
  }

  renderRecords() {
    if (this.state.rows == undefined || this.state.rows.length === 0) {
      return <tr className="striped--near-white">
        <td className={`tc pv3 ph4-l ph3-m ph2 ttu nowrap`}
          colSpan={this.props.columns.length + (this.props.showIndex ? 1 : 0)}>No Records!</td >
      </tr>
    }

    return (this.state.rows || []).map((row, index) =>
      <tr key={index} className="striped--near-white accent--hover pointer"
        onClick={event => this.onClickRow(row)}>
        {this.props.showIndex && <td className={`tc pv4 ph4-l ph3-m ph2 ttu nowrap`}>{index + 1}</td>}
        {row.map((value, colIndex) => {
          const alignment = this.props.columns[colIndex].alignRight ? 'tr' : 'tl'
          return <td key={`${index}${colIndex}`}
            className={`${alignment} pv3 ph4-l ph3-m ph2 nowrap ${this.props.columns[colIndex].className}`}>{
              typeof this.props.columns[colIndex].formatter === 'function' ?
                this.props.columns[colIndex].formatter(value, row, index, this.props.columns) : value
            }</td>
        })}
      </tr>
    )
  }

  renderLoading() {
    return <tr className="striped--near-white">
      <td className={`tc pv4 ph4-l ph3-m ph2 ttu nowrap`}
        colSpan={this.props.columns.length + (this.props.showIndex ? 1 : 0)}>
        <Loader></Loader>
      </td >
    </tr>
  }

  render() {
    return <table className={`${this.props.className} card collapse f5 tl w-100 shadow-1 br1`}>
      <tbody>
        {this.renderHeader()}
        {!this.props.loading && this.renderRecords()}
        {this.props.loading && this.renderLoading()}
      </tbody>
    </table>
  }

  toggleSort(index) {
    const sorts = {}
    const sort = this.state.sorts[index]
    sorts[index] = sort === true ? false : sort === false ? undefined : true
    this.sort(index, sorts)
  }

  sort(index, sorts) {
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

  onClickRow(row) {
    if (typeof this.props.onClickRow === 'function') {
      this.props.onClickRow(row)
    }
  }
}