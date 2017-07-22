import '../store'

import * as React from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'
import { data, inject } from 'statex/react'

import { AppState } from '../state/index'
import { AuthorizeAction } from '../action/index'
import { AuthorizePage } from './signup/authorize'
import { BrowserHistory } from 'react-router-dom'
import { LogPage } from './log/log'
import { MakeAnEntryDialog } from './make-an-entry/make-an-entry'
import { ProfilePage } from './signup/profile'
import { SetRedirectUrlAction } from '../action/user-actions'
import { SignInPage } from './signin/signin'
import { SignUpPage } from './signup/signup'
import { StatisticsPage } from './statistics/statistics'
import { User } from '../state/user'
import { UsersPage } from './users/users'

class Props {
  history?: BrowserHistory

  @data((state: AppState) => state.showForm)
  showForm?: boolean

  @data((state: AppState) => state.user)
  user?: User
}

@inject(Props)
export class App extends React.Component<Props, {}> {

  private authenticated: boolean

  componentDidMount() {
    Promise.resolve()
      .then(() => new SetRedirectUrlAction(location.pathname).dispatch())
      .then(() => new AuthorizeAction((redirectUrl, authenticated) => {
        this.authenticated = authenticated
        if (location.pathname !== redirectUrl) {
          this.props.history.replace(redirectUrl)
        }
      }).dispatch())
  }

  protect(targetPage, params?: Object, roles?: string[]) {
    return props => {
      if (!this.authenticated || this.props.user == undefined) {
        new SetRedirectUrlAction(location.pathname).dispatch()
        return <Redirect to="/signin" />
      }
      return React.createElement(targetPage, Object.assign({}, params, props, props.match && props.match.params))
    }
  }

  render() {
    return <div className="w-100 h-100">
      <Switch>
        <Route path="/logs" render={this.protect(LogPage)} />
        <Route path="/statistics" render={this.protect(StatisticsPage)} />
        <Route path="/users" render={this.protect(UsersPage)} />
        <Route path="/signin" component={SignInPage} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/authorize" component={AuthorizePage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="*" render={this.protect(Redirect, { to: '/statistics' })} />
      </Switch>
      {this.props.showForm && <MakeAnEntryDialog history={this.props.history}></MakeAnEntryDialog>}
    </div>
  }
}
