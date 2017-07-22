import '../store'

import * as React from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'
import { data, inject } from 'statex/react'

import { AppState } from '../state/index'
import { AuthorizeAction } from '../action/index'
import { AuthorizePage } from './signup/authorize'
import { BrowserHistory } from 'react-router-dom'
import { HomePage } from './home/home'
import { MakeAnEntryDialog } from './make-an-entry/make-an-entry'
import { ProfilePage } from './signup/profile'
import { SetRedirectUrlAction } from '../action/user-actions'
import { SignInPage } from './signin/signin'
import { SignUpPage } from './signup/signup'
import { StatisticsPage } from './statistics/statistics'

class Props {
  history?: BrowserHistory

  @data((state: AppState) => state.showForm)
  showForm?: boolean
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
          this.props.history.push(redirectUrl)
        }
      }).dispatch())
  }

  protect(targetPage, roles?: string[]) {
    return props => {
      if (!this.authenticated) {
        new SetRedirectUrlAction(location.pathname).dispatch()
        return <Redirect to="/signin" />
      }
      return React.createElement(targetPage, Object.assign({}, props, props.match && props.match.params))
    }
  }

  render() {
    return <div className="w-100 h-100">
      <Switch>
        <Route path="/home" render={this.protect(HomePage)} />
        <Route path="/statistics" render={this.protect(StatisticsPage)} />
        <Route path="/signin" component={SignInPage} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/authorize" component={AuthorizePage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="*" render={() => <Redirect to="/home" />} />
      </Switch>
      {this.props.showForm && <MakeAnEntryDialog history={this.props.history}></MakeAnEntryDialog>}
    </div>
  }
}
