import * as React from 'react'

import { Statistics, StatisticsEntry } from '../../state/statistics'
import { data, inject } from 'statex/react'

import { AppState } from '../../state'
import { BrowserHistory } from 'react-router-dom'
import { FetchStatisticsAction } from '../../action/statistics-actions'
import { Page } from '../page/page'
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
    return <Page history={this.props.history}>
      <div className="w-100 vh-100 overflow-hidden overflow-y-auto">
        <div className="f2 mb4 ph4 pt4">Statistics</div>
        <div className="overflow-hidden overflow-x-auto nowrap w-100 divider">
          {this.props.statistics != undefined && this.props.statistics.overall != undefined &&
            this.props.statistics.yearly == undefined && this.props.statistics.yearly.length > 1 &&
            this.renderStatistics('Overall', this.props.statistics.overall)}
          {this.props.statistics != undefined && this.props.statistics.yearly != undefined &&
            this.renderStatistics('Yearly', this.props.statistics.yearly)}
          {this.props.statistics != undefined && this.props.statistics.monthly != undefined &&
            this.renderStatistics('Monthly', this.props.statistics.monthly)}
          {this.props.statistics != undefined && this.props.statistics.weekly != undefined &&
            this.renderStatistics('Weekly', this.props.statistics.weekly)}
        </div>
        {(this.props.statistics === undefined || Object.keys(this.props.statistics).length === 0) &&
          <div>No log entries. Click on <span className="b">Make an Entry</span> to get started </div>
        }
      </div>
    </Page>
  }
}