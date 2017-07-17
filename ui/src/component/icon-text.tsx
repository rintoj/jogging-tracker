import * as React from 'react'

interface Props {
  icon?: string
  iconSize?: string
  className?: string
}
interface State { }

export class IconText extends React.Component<Props, State> {

  render() {
    return <div className={`flex items-center ${this.props.className}`}>
      <div className={`${this.props.iconSize || 'f4'}`}>
        <div className={`fa fa-${this.props.icon} mr2`}></div>
      </div>
      <div>{this.props.children}</div>
    </div>
  }
}