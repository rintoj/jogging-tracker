import * as React from 'react'

interface Props {
  color?: string
  onClose?: Function
}
interface State { }

export class Dialog extends React.Component<Props, State> {

  render() {
    return <div className="absolute absolute--fill flex items-center justify-center">
      <div className="title o-50 absolute absolute--fill" onClick={event => this.close()}></div>
      <div className={`flex flex-column justify-center mv4 ${this.props.color || 'white'} shadow-2 br1 z-1`}>
        {this.props.children}
      </div>
    </div>
  }

  close() {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose()
    }
  }
}