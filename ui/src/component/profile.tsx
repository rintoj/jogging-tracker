import * as React from 'react'

interface Props {
  name?: string
  role?: string
  profilePic?: string
  showButton?: boolean
}
interface State { }

export class Profile extends React.Component<Props, State> {

  render() {
    return <div className="flex items-center justify-around bt divider-l-br w-100 pv3">
      <div>
        <div className="white br-100 w2 h2 flex items-center justify-center">R</div>
      </div>
      <div className="flex flex-column flex-auto ph3">
        < div className="white-text nowrap ttu f6 flex-auto truncate">{this.props.name}</div>
        <div className="f6 pt1 o-60">{this.props.role}</div>
      </div>
      {this.props.showButton && <div className="accent-text ttu pointer pa2 accent--hover br1">Sign Out</div>}
    </div >
  }
}