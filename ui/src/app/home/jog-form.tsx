import * as React from 'react'

import { Button, Loader, TextInput, TimePicker } from '../../component'

import { AddJogLogAction } from '../../action/index'

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
    return <div className="flex justify-center w-100 mv4">
      <form className="flex justify-center items-start w-100">
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
        <div className="ml4">
          <div className="mt3 pt2"> </div>
          <Button onClick={event => this.add(event)} disabled={this.state.loading}>{
            this.state.loading ? <Loader primaryColor="title" secondaryColor="title"></Loader> : 'Add Log'
          }</Button>
        </div>
      </form>
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

  add(event) {
    event.preventDefault()
    if (this.validate()) {
      this.setState({ loading: true })
      new AddJogLogAction({
        date: this.state.date,
        time: this.state.time,
        distance: this.state.distance
      }).dispatch()
        .then(() => this.setState({ loading: false }))
        .catch(() => this.setState({ loading: false }))
    }
  }
}