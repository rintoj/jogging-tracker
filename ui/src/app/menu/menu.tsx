import * as React from 'react'

import { Button, IconText, Profile } from '../../component'
import { data, inject } from 'statex/react'

import { AppState } from '../../state/index'
import { BrowserHistory } from 'react-router-dom'
import { ShowFormAction } from '../../action/ui-actions'
import { SignOutAction } from '../../action'
import { User } from '../../state/user'
import { UserSelector } from '../user-selector/user-selector'

class Props {
  history?: BrowserHistory

  @data((state: AppState) => state.user)
  user?: User
}

interface State { }

@inject(Props)
export class Menu extends React.Component<Props, State> {

  get user() {
    return this.props.user || {}
  }

  render() {
    return <div className="primary flex flex-column vh-100 menu-node" style={{ minWidth: '280px' }}>
      <div className="flex flex-column justify-start bb divider-l-br w-100 ph3 secondary">
        <div className="title-node white-text f4 nowrap ttu ph2 pv3 mv1 divider-l-br bb">Jog Tracker</div>
        <Profile name={this.user.name}
          roles={this.user.authInfo && this.user.authInfo.roles} showButton={true}
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
          <IconText icon="pie-chart" className="statistics-node pa2 mt2 pointer accent--hover br1 ttu"
            onClick={event => this.goToStatisticsPage()}>Statistics</IconText>
          <IconText icon="address-card" className="log-entries-node pa2 mt2 pointer accent--hover br1 ttu"
            onClick={event => this.goHome()}>Log Entries</IconText>

          {this.props.user && this.props.user.authInfo && (this.props.user.authInfo.roles.indexOf('admin') >= 0 ||
            this.props.user.authInfo.roles.indexOf('manager') >= 0) &&
            <div>
              <div className="ttu pa2 o-60 mt4 divider-l-br bb">For Admin Users</div>
              <IconText icon="user-circle" className="manage-users-node pa2 mt2 pointer accent--hover br1 ttu"
                onClick={event => this.manageUsers()}>Manage Users</IconText>
            </div>
          }
        </div>
        <div className="flex-auto"></div>
        {this.props.user && this.props.user.authInfo && (this.props.user.authInfo.roles || []).indexOf('admin') >= 0 &&
          <UserSelector></UserSelector>}
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

  manageUsers() {
    this.props.history.push('/users')
  }

  goHome() {
    this.props.history.push('/logs')
  }
}