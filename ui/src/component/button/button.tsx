import * as React from 'react'

interface Props {
  color?: string
  className?: string
  submit?: boolean
  disabled?: boolean
  onClick?: Function
}
interface State { }

export class Button extends React.Component<Props, State> {

  render() {
    return <button type={this.props.submit ? 'submit' : 'button'}
      className={`${this.props.className} ${this.props.disabled ? 'divider' : this.props.color || 'accent'} nowrap divider-br ba br1 pa3 mv2 ttu f6`}
      style={{ height: '48px' }}
      disabled={this.props.disabled}
      onClick={event => this.onClick(event)}>
      {this.props.children}
    </button>
  }

  onClick(event) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event)
    }
  }
}