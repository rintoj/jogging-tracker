import * as React from 'react'
import * as moment from 'moment'

import { Button, Loader, TextInput, TimePicker } from '../../component'
import { data, inject } from 'statex/react'

import { AppState } from '../../state/index'
import { BrowserHistory } from 'react-router-dom'
import { Dialog } from '../../component/dialog/dialog'
import { HideFormAction } from '../../action/ui-actions'
import { JogLog } from '../../state/jog-log'
import { SaveJogLogAction } from '../../action/index'
import { Time } from '../../state/time'

class Props {
  history?: BrowserHistory

  @data((state: AppState) => state.selectedJogLog)
  jogLog?: JogLog
}

interface State {
  id?: string
  date?: string
  distance?: number
  time?: Time
  loading?: boolean
  errors?: {
    date?: string
    distance?: string
    time?: string
  }
}

@inject(Props)
export class MakeAnEntryDialog extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      errors: {}
    }
  }

  componentWillReceiveProps(props: Props) {
    this.props = props
    if (props.jogLog != undefined) {
      this.setState({
        id: this.props.jogLog.id,
        date: moment(this.props.jogLog.date).format('YYYY-MM-DD'),
        distance: this.props.jogLog.distance,
        time: (this.props.jogLog && this.props.jogLog.time) == undefined ? [0, 0] : [this.props.jogLog.time[0], this.props.jogLog.time[1]]
      })
    }
  }

  render() {
    return <Dialog onClose={event => this.close()}>
      <div className="make-an-entry-dialog pa4">
        <div className="f2 pb2 mb4 bb divider-br">{this.props.jogLog ? 'Edit' : 'Make'} an entry</div>
        <form className="flex flex-column justify-center item-start w-100">
          <div className="mb4 tc">
            <div>Log your jog time. Enter date, distance (in KM) and time (in HH:MM).</div>
            <div>Distance can be up to 100kms and time up to 100hrs.</div>
          </div>
          <div className="flex justify-center">
            <TextInput type="date"
              label="Date"
              min="0" max="100" step="0.01"
              value={this.state.date || ''}
              error={this.state.errors.date}
              disabled={this.state.loading}
              onChange={event => this.setState({ date: event.target.value })}></TextInput>
            <TextInput type="number"
              label="Distance"
              placeholder="km"
              className="ml4"
              min="0" max="100" step="0.01"
              value={this.state.distance + ''}
              disabled={this.state.loading}
              error={this.state.errors.distance}
              onChange={event => this.setState({ distance: parseFloat(event.target.value) })}></TextInput>
            <TimePicker label="Time"
              placeholder="Minutes"
              className="ml4"
              hourMax={100}
              value={this.state.time || [0, 0]}
              disabled={this.state.loading}
              error={this.state.errors.time}
              onChange={(event, value) => this.setState({ time: value })}></TimePicker>
          </div>
          <div className="flex items-center justify-center mt4">
            <Button submit={true} onClick={event => this.add(event)} disabled={this.state.loading}>{
              this.state.loading ? <Loader primaryColor="title" secondaryColor="title"></Loader> :
                this.props.jogLog ? <div className="flex items-center justify-center">
                  <div className="fa fa-edit"></div>
                  <div className="ml2">Update Log</div>
                </div> : <div className="flex items-center justify-center">
                    <div className="fa fa-plus"></div>
                    <div className="ml2">Add Log</div>
                  </div>
            }</Button>
            <Button className="ml3" color="primary" onClick={event => this.close()} disabled={this.state.loading}>{
              <div className="flex items-center justify-center">
                <div className="fa fa-times"></div>
                <div className="ml2">Cancel</div>
              </div>
            }</Button>
          </div>
        </form>
      </div>
    </Dialog>
  }

  validate() {
    const errors = {
      date: this.state.date == undefined ? 'Required' : undefined,
      time: this.state.time == undefined ? 'Required' :
        this.state.time.length !== 2 || this.state.time[0] < 0 || this.state.time[0] > 100 ||
          this.state.time[1] < 0 || this.state.time[1] > 59 ?
          'Invalid time' : undefined,
      distance: this.state.distance == undefined ? 'Required' :
        this.state.distance < 0 || this.state.distance > 100 ? 'Invalid distance' : undefined
    }

    this.setState({ errors })
    return Object.keys(errors).filter(i => errors[i] != undefined).length === 0
  }

  close() {
    return new HideFormAction().dispatch()
  }

  add(event) {
    event.preventDefault()
    if (!this.validate()) return

    this.setState({ loading: true })
    new SaveJogLogAction({
      id: this.state.id,
      date: this.state.date,
      time: this.state.time,
      distance: this.state.distance
    }).dispatch()
      .then(() => this.setState({ loading: false }))
      .then(() => this.props.history.push('/logs'))
      .then(() => this.close())
      .catch(() => this.setState({ loading: false }))

  }
}