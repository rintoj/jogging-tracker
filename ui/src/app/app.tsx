import '../store'

import * as React from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'
import { data, inject } from 'statex/react'

import { AppState } from '../state/index'
import { AuthorizeAction } from '../action/index'
import { BrowserHistory } from 'react-router-dom'
import { LogPage } from './log/log-page'
import { MakeAnEntryDialog } from './make-an-entry/make-an-entry-dialog'
import { ProfilePage } from './signup/profile-page'
import { SetRedirectUrlAction } from '../action/user-actions'
import { SignInPage } from './signin/signin-page'
import { SignUpPage } from './signup/signup-page'
import { StatisticsPage } from './statistics/statistics-page'
import { User } from '../state/user'
import { UsersPage } from './users/users-page'

class Props {
  history?: BrowserHistory

  @data((state: AppState) => state.showForm)
  showForm?: boolean

  @data((state: AppState) => state.user)
  user?: User
}

@inject(Props)
export class App extends React.Component<Props, {}> {

  componentDidMount() {
    Promise.resolve()
      .then(() => new SetRedirectUrlAction(location.pathname).dispatch())
      .then(() => new AuthorizeAction((redirectUrl) => {
        if (location.pathname !== redirectUrl) {
          this.props.history.replace(redirectUrl)
        }
      }).dispatch())
  }

  protect(targetPage, params?: Object, roles?: string[]) {
    return props => {
      if (this.props.user == undefined) {
        new SetRedirectUrlAction(location.pathname).dispatch()
        return <Redirect to="/signin" />
      } else if (roles != undefined && (this.props.user.authInfo == undefined ||
        this.props.user.authInfo.roles == undefined || roles.indexOf(this.props.user.authInfo.roles[0])) < 0) {
        new SetRedirectUrlAction(location.pathname).dispatch()
        return <Redirect to="/statistics" />
      }
      return React.createElement(targetPage, Object.assign({}, params, props, props.match && props.match.params))
    }
  }

  render() {
    return <div className="w-100 h-100">
      <Switch>
        <Route path="/logs" render={this.protect(LogPage)} />
        <Route path="/statistics" render={this.protect(StatisticsPage)} />
        <Route path="/users" render={this.protect(UsersPage, undefined, ['admin', 'manager'])} />
        <Route path="/profile" render={this.protect(ProfilePage)} />
        <Route path="/signin" component={SignInPage} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="*" render={this.protect(Redirect, { to: '/statistics' })} />
      </Switch>
      {this.props.showForm && <MakeAnEntryDialog history={this.props.history}></MakeAnEntryDialog>}
    </div>
  }
}
