import * as React from 'react'

import { Button, Loader, TextInput, TimePicker } from '../../component'

import { AddJogLogAction } from '../../action/index'
import { HideFormAction } from '../../action/ui-actions'

interface Props { }

interface State {
  date?: string
  distance?: number
  time?: [number, number]
  loading?: boolean
  errors?: {
    date?: string
    distance?: string
    time?: string
  }
}

export class JogForm extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      errors: {}
    }
  }

  render() {
    return <div className="absolute absolute--fill flex items-center justify-center">
      <div className="title o-50 absolute absolute--fill"></div>
      <div className="flex flex-column justify-center mv4 white shadow-1 pa4 br1 z-1">
        <div className="f2 pb2 mb4 bb divider-br">Make an entry</div>
        <form className="flex flex-column justify-center item-start w-100">
          <div className="flex justify-center items-center">
            <TextInput type="date"
              label="Date"
              min="0" max="100" step="0.01"
              error={this.state.errors.date}
              disabled={this.state.loading}
              onChange={event => this.setState({ date: event.target.value })}></TextInput>
            <TextInput type="number"
              label="Distance"
              placeholder="KM"
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
              value={this.state.time}
              disabled={this.state.loading}
              error={this.state.errors.time}
              onChange={(event, value) => this.setState({ time: value })}></TimePicker>
          </div>
          <div className="flex items-center justify-center mt4">
            <Button submit={true} onClick={event => this.add(event)} disabled={this.state.loading}>{
              this.state.loading ? <Loader primaryColor="title" secondaryColor="title"></Loader> :
                <div className="flex items-center justify-center">
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
    </div>
  }

  validate() {
    const errors = {
      date: this.state.date == undefined ? 'Required!' : undefined,
      time: this.state.time == undefined ? 'Required!' : undefined,
      distance: this.state.distance == undefined ? 'Required!' : undefined
    }

    this.setState({ errors })
    return Object.keys(errors).filter(i => errors[i] != undefined).length === 0
  }

  close() {
    new HideFormAction().dispatch()
  }

  add(event) {
    event.preventDefault()
    if (this.validate()) {
      this.setState({ loading: true })
      new AddJogLogAction({
        date: this.state.date,
        time: this.state.time,
        distance: this.state.distance
      }).dispatch()
        .then(() => this.setState({ loading: false, time: undefined, distance: undefined, date: undefined }))
        .then(() => this.close())
        .catch(() => this.setState({ loading: false, time: undefined, distance: undefined, date: undefined }))
    }
  }
}