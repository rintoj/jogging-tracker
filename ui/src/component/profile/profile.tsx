import * as React from 'react'

interface Props {
  name?: string
  role?: string
  picture?: string
  showButton?: boolean
  onProfileClick?: Function
  onButtonClick?: Function
}
interface State { }

export class Profile extends React.Component<Props, State> {

  render() {
    return <div className="flex items-center justify-around bt divider-l-br w-100 pv2">
      <div className="flex flex-auto pointer divider-l--hover pa1"
        onClick={event => this.onProfileClick(event)}>
        <div className="avatar">
          {this.props.picture && <img src={this.props.picture} alt="" className="divider-l-br ba br-100 avatar" />}
          {!this.props.picture && <div className="white br-100 avatar flex items-center justify-center">R</div>}
        </div>
        <div className="flex flex-column justify-center flex-auto ph3">
          < div className="white-text nowrap ttu f6 truncate">{this.props.name}</div>
          <div className="f6 pt1 o-60">{this.props.role}</div>
        </div>
      </div>
      {this.props.showButton && <div className="accent-text ttu pointer pa2 nowrap accent--hover br1"
        onClick={event => this.onButtonClick(event)}>Sign Out</div>}
    </div >
  }

  onProfileClick(event) {
    if (typeof this.props.onProfileClick === 'function') {
      this.props.onProfileClick(event)
    }
  }

  onButtonClick(event) {
    if (typeof this.props.onButtonClick === 'function') {
      this.props.onButtonClick(event)
    }
  }
}