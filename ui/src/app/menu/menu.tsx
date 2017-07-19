import * as React from 'react'

import { Accordion, IconText, Profile } from '../../component'
import { data, inject } from 'statex/react'

import { AppState } from '../../state/index'
import { SignOutAction } from '../../action'
import { User } from '../../state/user'

class Props {
  history?: string[]

  @data((state: AppState) => state.user)
  user?: User
}

interface State {
  open?: boolean
}

@inject(Props)
export class MenuComponent extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      open: true
    }
  }

  get user() {
    return this.props.user || {}
  }

  get role() {
    const { user } = this.props
    const roles = (user && user.authInfo && user.authInfo.roles || [])
    if (roles.indexOf('admin') >= 0) return 'Administrator'
    if (roles.indexOf('manager') >= 0) return 'Manager'
    return 'User'
  }

  render() {
    return <div className="primary flex flex-column vh-100" style={{ width: (this.state.open ? '280' : '0') + 'px' }}>
      <div className="flex flex-column justify-start bb divider-l-br w-100 ph3 secondary">
        <div className="white-text f4 nowrap ttu ph2 pv3 mv1">Jog Tracker</div>
        <Profile name={this.user.name}
          role={this.role} showButton={true}
          picture={this.user.picture}
          onProfileClick={event => this.showProfile(event)}
          onButtonClick={event => this.signOut(event)}
        ></Profile>
      </div>
      <div className="ph3 pv1 flex-auto">
        <Accordion title="Navigation" icon="navicon" className="pt3" open={true}>
          <IconText icon="home" className="pa2 pointer accent--hover br1">Home</IconText>
          <IconText icon="home" className="pa2 pointer accent--hover br1">Home</IconText>
        </Accordion>
        <Accordion title="Manage Users" icon="user-circle" className="pt3" open={true}>
          <IconText icon="home" className="pa2 pointer accent--hover br1">Home</IconText>
          <IconText icon="home" className="pa2 pointer accent--hover br1">Home</IconText>
        </Accordion>
        <IconText icon="cogs" className="ttu pt3 pointer">Settings</IconText>
      </div>
    </div>
  }

  showProfile(event) {
    this.props.history.push('/profile')
  }

  signOut(event) {
    new SignOutAction().dispatch()
  }
}