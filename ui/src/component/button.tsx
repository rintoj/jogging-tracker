import * as React from 'react'

interface Props {
  color?: string
  className?: string
}
interface State { }

export class Button extends React.Component<Props, State> {

  render() {
    return <button className={`${this.props.className} ${this.props.color || 'accent'} divider-br br1 pv2 ph3 ttu f6`}>
      {this.props.children}
    </button>
  }
}