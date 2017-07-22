import * as React from 'react'

import { Accordion, Button, IconText, Profile } from '../../component'
import { data, inject } from 'statex/react'

import { AppState } from '../../state/index'
import { Banner } from '../home/banner'
import { BrowserHistory } from 'react-router-dom'
import { ShowFormAction } from '../../action/ui-actions'
import { SignOutAction } from '../../action'
import { User } from '../../state/user'

class Props {
  history?: BrowserHistory

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
    return <div className="primary flex flex-column vh-100" style={{ minWidth: (this.state.open ? '280' : '0') + 'px' }}>
      <div className="flex flex-column justify-start bb divider-l-br w-100 ph3 secondary">
        <div className="white-text f4 nowrap ttu ph2 pv3 mv1">Jog Tracker</div>
        <Profile name={this.user.name}
          role={this.role} showButton={true}
          picture={this.user.picture}
          onProfileClick={event => this.showProfile(event)}
          onButtonClick={event => this.signOut(event)}
        ></Profile>
      </div>
      <div className="mh3 mt3 ph2">
        <Button className="w-100" onClick={event => this.makeAnEntry()}>
          <div className="flex items-center justify-center">
            <div className="fa fa-add"></div>
            <div className="ml2">Make an entry</div>
          </div>
        </Button>
      </div>
      <div className="flex flex-column flex-auto">
        <div className="ph3">
          <div className="ttu pa2 o-60 mt4 divider-l-br bb">Navigation</div>
          <IconText icon="pie-chart" className="pa2 mt2 pointer accent--hover br1 ttu"
            onClick={event => this.goToStatisticsPage()}>Statistics</IconText>
          <IconText icon="address-card" className="pa2 mt2 pointer accent--hover br1 ttu"
            onClick={event => this.goHome()}>Log Entries</IconText>

          <div className="ttu pa2 o-60 mt4 divider-l-br bb">For Admin Users</div>
          <Accordion title="Manage Users" icon="user-circle" className="pa2 mt2" open={false}>
            <IconText icon="home" className="pa2 pointer accent--hover br1">Home</IconText>
            <IconText icon="home" className="pa2 pointer accent--hover br1">Home</IconText>
          </Accordion>
        </div>
        <div className="flex-auto"></div>
        {this.props.user && this.props.user.authInfo &&
          (this.props.user.authInfo.roles || []).indexOf('admin') >= 0 &&
          <Banner></Banner>}
      </div>
    </div>
  }

  showProfile(event) {
    this.props.history.push('/profile')
  }

  signOut(event) {
    new SignOutAction().dispatch()
      .then(() => this.props.history.replace('/signin'))
  }

  makeAnEntry() {
    new ShowFormAction().dispatch()
  }

  goToStatisticsPage() {
    this.props.history.push('/statistics')
  }

  goHome() {
    this.props.history.push('/home')
  }
}