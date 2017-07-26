import * as React from 'react'

interface Props {
  icon?: string
  iconSize?: string
  className?: string
  onClick?: Function
}
interface State { }

export class IconText extends React.Component<Props, State> {

  render() {
    return <div className={`flex items-center ${this.props.className} root-node`}
      onClick={(event) => this.onClick(event)}>
      <div className={`${this.props.iconSize || 'f4'}`}>
        <div className={`fa fa-${this.props.icon} mr2`}></div>
      </div>
      <div className="text-node">{this.props.children}</div>
    </div>
  }

  onClick(event) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event)
    }
  }
}