import * as React from 'react'

interface Props {
  id?: string
  type?: 'text' | 'number' | 'password' | 'color'
  value?: string
  label?: string
  placeholder?: string
  onFocus?: Function
  onBlur?: Function
  onChange?: Function
}
interface State { }

export class TextInput extends React.Component<Props, State> {

  render() {
    return <div className="flex flex-column mt3">
      <label htmlFor={this.props.id}>{this.props.label}</label>
      <input className="divider-br br1 pa3 mv2"
        id={this.props.id}
        placeholder={this.props.placeholder || this.props.label}
        type={this.props.type} value={this.props.value}
        onFocus={(event) => this.onFocus(event)}
        onBlur={(event) => this.onBlur(event)}
        onChange={(event) => this.onChange(event)}
      />
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