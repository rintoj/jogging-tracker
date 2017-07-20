import * as React from 'react'

import { Button, TextInput, TimePicker } from '../../component'

interface Props { }

interface State {
  date?: string
  distance?: string
  time?: string
  errors?: {
    date?: string
    distance?: string
    time?: string
  }
}

export class JogForm extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = { errors: {} }
  }

  render() {
    console.log(this.state)
    return <div className="flex justify-center w-100 mv4">
      <form className="flex justify-center items-start w-100">
        <TextInput type="date"
          label="Date"
          min="0" max="100" step="0.01"
          error={this.state.errors.date}
          onChange={event => this.setState({ date: event.target.value })}></TextInput>
        <TextInput type="number"
          label="Distance"
          placeholder="KM"
          className="ml4"
          min="0" max="100" step="0.01"
          error={this.state.errors.distance}
          onChange={event => this.setState({ distance: event.target.value })}></TextInput>
        <TimePicker label="Time"
          placeholder="Minutes"
          className="ml4"
          hourMax={100}
          error={this.state.errors.time}
          onChange={(event, value) => this.setState({ time: value })}></TimePicker>
        <div className="ml4">
          <div className="mt3 pt2"> </div>
          <Button onClick={event => this.add(event)}>Add Log</Button>
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
    console.log(this.state)
    if (this.validate()) {
      console.log('valid')
    }
  }
}