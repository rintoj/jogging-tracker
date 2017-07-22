import * as React from 'react'

interface Props {
  name?: string
  roles?: string[]
  picture?: string
  color?: string
  showButton?: boolean
  onProfileClick?: Function
  onButtonClick?: Function
}
interface State { }

export class Profile extends React.Component<Props, State> {

  get role() {
    const { roles } = this.props
    if (roles == undefined) return ''
    if (roles.indexOf('admin') >= 0) return 'Administrator'
    if (roles.indexOf('manager') >= 0) return 'Manager'
    return 'User'
  }

  render() {
    return <div className="flex items-center justify-around w-100 pv2">
      <div className="flex flex-auto pointer divider-l--hover pa1 br1"
        onClick={event => this.onProfileClick(event)}>
        <div className="avatar">
          {this.props.picture && <img src={this.props.picture} alt="" className="divider-l-br ba br-100 avatar" />}
          {!this.props.picture && <div className="br-100 avatar ttu flex items-center justify-center ternary">
            {(this.props.name || 'UR').substr(0, 2)}
          </div>}
        </div>
        <div className="flex flex-column justify-center flex-auto ph3">
          < div className={`${this.props.color || 'white-text'} nowrap ttu f6 truncate`}>{this.props.name}</div>
          <div className="f6 pt1 o-60">{this.role}</div>
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