import * as React from 'react'
import * as moment from 'moment'

import { MonthlyStatisticsEntry, StatisticsEntry, WeeklyStatisticsEntry, YearlyStatisticsEntry } from '../../state/statistics'

interface Props {
  type?: string
  entries?: StatisticsEntry[]
}

interface State {
  selectedIndex?: number
}

export class StatisticsCard extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0
    }
  }

  render() {
    if (this.props.entries == undefined || this.props.entries.length === 0) return <div />
    const { type, entries } = this.props
    return <div className="card br1 shadow-1 ma3 divider-br ba" style={{ width: '250px' }}>
      <div className="w-100 accent" style={{ height: '3px' }}></div>
      <div className="ph2 flex items-center">
        <div className="pv2">
          <div className="dib ttu mt2 mb2 banner pv2 ph3 nl3 nowrap w4">{type}</div>
        </div>
        <div className="flex-auto w-100 flex justify-end pa2">
          {type !== 'Overall' && <select className="bn transparent outline-0 f6 h2"
            onChange={event => this.onSelect(event)}>
            {entries.map((entry, index) => <option key={index} value={index}>
              {this.toTitle(entry)}
            </option>)}
          </select>}
        </div>
      </div>
      {this.renderStatisticsEntry(entries[this.state.selectedIndex])}
    </div>
  }

  toMonthName(month: number) {
    return new Date(2000, month, 1).toLocaleString('en-us', { month: 'long' })
  }

  weekRange(week: number) {
    const range = `${moment(new Date()).week(week).add(1, 'day').format('MMM DD')} - ${moment(new Date()).week(week + 1).format('DD')}`
    return range
  }

  toTitle(entry: StatisticsEntry) {
    if (entry.type === 'year') {
      const yearlyEntry: YearlyStatisticsEntry = entry as YearlyStatisticsEntry
      return `${yearlyEntry.year}`
    } else if (entry.type === 'month') {
      const monthlyEntry: MonthlyStatisticsEntry = entry as MonthlyStatisticsEntry
      return `${monthlyEntry.year} ${this.toMonthName(monthlyEntry.month)} `
    } else if (entry.type === 'week') {
      const weeklyEntry: WeeklyStatisticsEntry = entry as WeeklyStatisticsEntry
      return `${weeklyEntry.year}: ${this.weekRange(weeklyEntry.week)} `
    }
    return 'Overall'
  }

  renderValue(text: string, value: any, unit?: string) {
    return <div className="flex flex-column items-center justify-center pa3"
      key={`${text}:${value}`}>
      <div className="nowrap">
        <span className="f4 b">{value}</span>
        <span className="f6 o-60"> {unit}</span>
      </div>
      <div className="f5 o-60 mt2">{text}</div>
    </div>
  }

  renderStatisticsEntry(entry: StatisticsEntry) {
    return <div className="flex flex-column ph3 pb3">
      <div className="flex flex-column justify-center items-center">
        <div className="tc mt3 ttu flex items-center justify-center w-100">
          <div className="br bb divider-br flex-auto"></div>
          <div className="ph3">Speed</div>
          <div className="br bb divider-br flex-auto"></div>
        </div>
        <div className="flex justify-around w-90">
          {this.renderValue('Fastest', entry.fastest, 'km/h')}
          {this.renderValue('Slowest', entry.slowest, 'km/h')}
        </div>
      </div>
      <div className="flex flex-column justify-center items-center">
        <div className="tc mt3 ttu flex items-center justify-center w-100">
          <div className="br bb divider-br flex-auto"></div>
          <div className="ph3">Distance</div>
          <div className="br bb divider-br flex-auto"></div>
        </div>
        <div className="flex justify-around w-90">
          {this.renderValue('Longest', entry.longestDistance, 'km')}
          {this.renderValue('Shortest', entry.shortestDistance, 'km')}
        </div>
      </div>
      <div className="flex flex-column justify-center items-center">
        <div className="tc mt3 ttu flex items-center justify-center w-100">
          <div className="br bb divider-br flex-auto"></div>
          <div className="ph3">Total</div>
          <div className="br bb divider-br flex-auto"></div>
        </div>
        <div className="flex justify-around w-90">
          {this.renderValue('Distance', parseFloat(entry.distance + '').toFixed(2), 'km')}
          {this.renderValue('Time', entry.time.join(':'), 'hrs')}
        </div>
      </div>
    </div>
  }

  onSelect(event) {
    this.setState({
      selectedIndex: event.nativeEvent.target.selectedIndex
    })
  }
}