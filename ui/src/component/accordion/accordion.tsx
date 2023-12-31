import * as React from 'react'

import { IconText } from '..'

interface Props {
  title: string
  icon?: string
  open?: boolean
  className?: string
  badge?: string
  onBadgeClick?: Function
  onToggle?: Function
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
    if (typeof this.props.onToggle === 'function') {
      this.props.onToggle(!this.state.open)
    }
    this.setState(state => ({ open: !state.open }))
  }

  render() {
    return <div className={`${this.props.className}`}>
      <div className="flex items-center pointer root"
        onClick={this.onClick.bind(this)}>
        <IconText icon={this.props.icon}
          className="pointer ttu mr3">{this.props.title}</IconText>
        <div className={`fa fa-caret-${this.state.open ? 'up' : 'down'}`}></div>
        {this.props.badge && !this.state.open && <div className="badge-node accent-text ml3 br3 ttu f5"
          onClick={event => this.onBadgeClick(event)}>{this.props.badge}</div>}
      </div>
      {this.state.open && <div className="pv3">
        {this.props.children}
      </div>
      }
    </div>
  }

  onBadgeClick(event) {
    event.stopPropagation()
    if (typeof this.props.onBadgeClick === 'function') {
      this.props.onBadgeClick(event)
    }
  }
}
