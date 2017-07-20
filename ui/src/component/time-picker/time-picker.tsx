import * as React from 'react'

interface Props {
  value?: string
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
  hour?: string
  minute?: string
}

export class TimePicker extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    let value = (this.props.value || '0:0').split(':')
    this.state = {
      hour: value[0],
      minute: value[1]
    }
  }

  render() {

    return <div className={`${this.props.className} flex flex-column mt2`} >
      <label className="title-text ttu f6 b nowrap">{this.props.label}</label>
      <div className={`flex items-center white ba br1 mv2 ${this.props.error != undefined ? 'error-br' : 'divider-br'}`}>
        <input className="bn pl2 tr outline-0"
          autoFocus={this.props.autoFocus}
          disabled={this.props.disabled}
          min={Math.max(0, this.props.hourMin || 0)}
          max={Math.min(1000, this.props.hourMax || 1000)}
          step={this.props.step}
          required={this.props.required}
          style={{ width: '48px', height: '48px' }}
          type="number" value={this.props.value}
          placeholder={'00'}
          onFocus={(event) => this.onFocus(event)}
          onBlur={(event) => this.onBlur(event)}
          onChange={(event) => this.onChange(event, 'hour')}
        />
        <div className="white pv3">:</div>
        <input className="bn ph2 tc outline-0"
          disabled={this.props.disabled}
          min={Math.max(0, this.props.minuteMin || 0)}
          max={Math.min(59, this.props.minuteMax || 59)}
          step={this.props.step}
          required={this.props.required}
          style={{ width: '48px', height: '48px' }}
          type="number" value={this.props.value}
          placeholder={'00'}
          onFocus={(event) => this.onFocus(event)}
          onBlur={(event) => this.onBlur(event)}
          onChange={(event) => this.onChange(event, 'minute')}
        />
      </div>
      <div className="error-text">{this.props.error}</div>
    </div>
  }

  onChange(event, type) {

    const value = Object.assign({}, this.state)
    value[type] = event.target.value.trim() === '' ? '0' : event.target.value
    this.setState(value)

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, `${value.hour}:${value.minute}`)
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