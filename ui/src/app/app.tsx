import '../store'

import * as React from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'

import { AuthCodePage } from './login/auth-code'
import { AuthorizePage } from './login/authorize'
import { HomePage } from './home/home'
import { PasswordPage } from './login/password'
import { SignInPage } from './login/sign-in'
import { SignUpPage } from './login/sign-up'

export class App extends React.Component<{}, {}> {

  loggedIn = true

  protect(targetPage, roles?: string[]) {
    return props => {
      if (!this.loggedIn) {
        this.loggedIn = true
        return <Redirect to="/signin" />
      }
      return React.createElement(HomePage, Object.assign({}, props, props.match && props.match.params))
    }
  }

  render() {
    return <Switch>
      <Route path="/home" render={this.protect(HomePage)} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/auth-code" component={AuthCodePage} />
      <Route path="/password" component={PasswordPage} />
      <Route path="/authorize" component={AuthorizePage} />
      <Route path="*" render={() => <Redirect to="/home" />} />
    </Switch>
  }
}
