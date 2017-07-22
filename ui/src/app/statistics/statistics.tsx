import * as React from 'react'
import * as moment from 'moment'

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

  getOverall() {
    return this.props.statistics && this.props.statistics.overall && this.props.statistics.overall[0]
  }

  moonDistance(overall) {
    return this.round(overall.distance / 3840, 4)
  }

  round(value: number, decimalPoints = 2) {
    return parseFloat(`${value}`).toFixed(decimalPoints)
  }

  render() {
    const overall = this.getOverall()
    return <Page history={this.props.history}>
      <div className="flex-auto w-100 vh-100 overflow-hidden overflow-y-auto">
        {this.props.statistics !== undefined && <div>
          <div className="pa4 flex items-center justify-around flex-wrap">
            <div className="flex flex-column items-center justify-center ma4">
              <div className="f2 mt2 nowrap">{this.moonDistance(overall)} <span className="f5">%</span></div>
              <div className="tc f5 ttu mt2 nowrap">of distance to moon</div>
            </div>
            <div className="flex flex-column items-center justify-center ma4">
              <div className="f2 mt2 nowrap">{moment(overall.longestDistDate).format('YYYY MMM DD')}</div>
              <div className="tc f5 ttu mt2 nowrap">longest distance on</div>
            </div>
            <div className="flex flex-column items-center justify-center ma4">
              <div className="f2 mt2 nowrap">{this.round(overall.distance)} <span className="f5">km</span></div>
              <div className="tc f5 ttu mt2 nowrap">Total Distance</div>
            </div>
            <div className="flex flex-column items-center justify-center ma4">
              <div className="f2 mt2 nowrap">{(overall.time || [0, 0]).join(':')} <span className="f5">hrs</span></div>
              <div className="tc f5 ttu mt2 nowrap">Total Time</div>
            </div>
          </div>
          <div className="overflow-hidden overflow-x-auto nowrap w-100 divider">
            {this.props.statistics.yearly != undefined && this.props.statistics.monthly.length > 1 &&
              this.renderStatistics('Yearly', this.props.statistics.yearly)}
            {this.props.statistics.monthly != undefined && this.props.statistics.weekly.length > 1 &&
              this.renderStatistics('Monthly', this.props.statistics.monthly)}
            {this.props.statistics.weekly != undefined &&
              this.renderStatistics('Weekly', this.props.statistics.weekly)}
          </div>
        </div>}
        {this.props.statistics === undefined && <div>
          <div className="f2 ph4 pt4">Statistics</div>
          <div className="ph4 mt4">No log entries. Click on <span className="b">Make an Entry</span> to get started </div>
        </div>
        }
      </div>
    </Page>
  }
}