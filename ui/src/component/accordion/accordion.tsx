import * as React from 'react'

import { IconText } from '..'

interface Props {
  title: string
  icon?: string
  open?: boolean
  className?: string
}
interface State {
  open?: boolean
}

export class Accordion extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      open: this.props.open
    }
  }

  onClick() {
    this.setState(state => ({ open: !state.open }))
  }

  render() {
    return <div className={`${this.props.className}`}>
      <div className="flex">
        <IconText icon={this.props.icon}
          className="pointer ttu flex-auto"
          onClick={this.onClick.bind(this)}>{this.props.title}</IconText>
        <div className={`fa fa-caret-${this.state.open ? 'up' : 'down'}`}></div>
      </div>
      {this.state.open && <div className="pv3">
        {this.props.children}
      </div>
      }
    </div>
  }
}
