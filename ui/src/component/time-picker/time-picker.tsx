import * as React from 'react'

interface Props {
  value?: [number, number]
  label?: string
  error?: string
  autoFocus?: boolean
  hourMin?: number
  hourMax?: number
  minuteMin?: number
  minuteMax?: number
  step?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  onFocus?: Function
  onBlur?: Function
  onChange?: Function
  className?: string
}
interface State {
  value?: [number, number]
}

export class TimePicker extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(props) {
    this.props = props
    const value = this.props.value
    this.setState({ value })
  }

  render() {
    const color = this.props.disabled ? 'divider' : 'white'
    return <div className={`${this.props.className} flex flex-column mt2`} >
      <label className="title-text ttu f6 b nowrap">{this.props.label}</label>
      <div
        className={`flex items-center ba br1 mv2 ${color} ${this.props.error != undefined ? 'error-br' : 'divider-br'}`}>
        <input className="bn pl2 tr outline-0 transparent"
          autoFocus={this.props.autoFocus}
          disabled={this.props.disabled}
          min={Math.max(0, this.props.hourMin || 0)}
          max={Math.min(1000, this.props.hourMax || 1000)}
          step={this.props.step}
          required={this.props.required}
          style={{ width: '48px', height: '48px' }}
          type="number"
          value={`${this.state.value && this.state.value[0]}`}
          placeholder={'HH'}
          onFocus={(event) => this.onFocus(event)}
          onBlur={(event) => this.onBlur(event)}
          onChange={(event) => this.onChange(event, 'hour')}
        />
        <div className="pv3">:</div>
        <input className="bn pl2 tr outline-0 transparent"
          disabled={this.props.disabled}
          min={Math.max(0, this.props.minuteMin || 0)}
          max={Math.min(59, this.props.minuteMax || 59)}
          step={this.props.step}
          required={this.props.required}
          style={{ width: '48px', height: '48px' }}
          type="number"
          value={`${this.state.value && this.state.value[1]}`}
          placeholder={'MM'}
          onFocus={(event) => this.onFocus(event)}
          onBlur={(event) => this.onBlur(event)}
          onChange={(event) => this.onChange(event, 'minute')}
        />
      </div>
      <div className="error-text">{this.props.error}</div>
    </div>
  }

  onChange(event, type) {
    const value: [number, number] = this.state.value || [0, 0]
    value[type === 'hour' ? 0 : 1] = event.target.value.trim() === '' ? 0 : parseInt(event.target.value, undefined)
    this.setState({ value })

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, value)
    }
  }

  onFocus(event) {
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus(event)
    }
  }

  onBlur(event) {
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(event)
    }
  }
}