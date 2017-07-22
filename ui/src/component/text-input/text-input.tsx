import * as React from 'react'

interface Props {
  id?: string
  type?: 'text' | 'number' | 'password' | 'color' | 'date' | 'time'
  value?: string
  label?: string
  error?: string
  autoFocus?: boolean
  min?: string
  max?: string
  step?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  onFocus?: Function
  onBlur?: Function
  onChange?: Function
  className?: string
  style?: Object
}
interface State { }

export class TextInput extends React.Component<Props, State> {

  render() {
    return <div className={`${this.props.className} flex flex-column mt2`} style={this.props.style} >
      <label className="title-text ttu f6 b nowrap" htmlFor={this.props.id}>{this.props.label}</label>
      <input id={this.props.id}
        className={`br1 ba pa3 mv2 ${this.props.disabled ? 'divider' : 'white'} ${this.props.error != undefined ? 'error-br' : 'divider-br'}`}
        autoFocus={this.props.autoFocus}
        disabled={this.props.disabled}
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        required={this.props.required}
        style={{ height: '48px' }}
        type={this.props.type} value={this.props.value}
        placeholder={this.props.placeholder || this.props.label}
        onFocus={(event) => this.onFocus(event)}
        onBlur={(event) => this.onBlur(event)}
        onChange={(event) => this.onChange(event)}
      />
      <div className="error-text">{this.props.error}</div>
    </div>
  }

  onChange(event) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event)
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