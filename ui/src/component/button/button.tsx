import * as React from 'react'

interface Props {
  color?: string
  className?: string
  submit?: boolean
  onClick?: Function
}
interface State { }

export class Button extends React.Component<Props, State> {

  render() {
    return <button className={`${this.props.className} ${this.props.color || 'accent'} nowrap divider-br ba br1 pa3 mv2 ttu f6`}
      type={this.props.submit ? 'submit' : 'button'}
      style={{ height: '48px' }}
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