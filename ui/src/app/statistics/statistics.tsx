import * as React from 'react'

import { Statistics, StatisticsEntry } from '../../state/statistics'
import { data, inject } from 'statex/react'

import { AppState } from '../../state'
import { BrowserHistory } from 'react-router-dom'
import { FetchStatisticsAction } from '../../action/statistics-actions'
import { MenuComponent } from '../menu/menu'
import { StatisticsCard } from './statistics-card'

class Props {
  history?: BrowserHistory

  @data((state: AppState) => state.statistics)
  statistics: Statistics
}

interface State { }

@inject(Props)
export class StatisticsPage extends React.Component<Props, State> {

  componentDidMount() {
    new FetchStatisticsAction().dispatch()
  }

  renderStatistics(type: string, entries: StatisticsEntry[]) {
    return <StatisticsCard type={type} entries={entries}></StatisticsCard>
  }

  render() {
    return <div className="flex">
      <MenuComponent history={this.props.history} />
      <div className="pa4 w-100 vh-100 overflow-hidden overflow-y-auto">
        <div className="f2 mb4">Statistics</div>
        <div className="flex justify-start flex-wrap">
          {this.props.statistics != undefined && this.props.statistics.yearly.length > 1 &&
            this.renderStatistics('Overall', this.props.statistics.overall)}
          {this.props.statistics != undefined &&
            this.renderStatistics('Yearly', this.props.statistics.yearly)}
          {this.props.statistics != undefined &&
            this.renderStatistics('Monthly', this.props.statistics.monthly)}
          {this.props.statistics != undefined &&
            this.renderStatistics('Weekly', this.props.statistics.weekly)}
        </div>
      </div>
    </div>
  }
}