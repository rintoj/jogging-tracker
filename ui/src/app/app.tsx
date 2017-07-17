import '../store'

import * as React from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'

import { AuthCodePage } from './login/auth-code'
import { HomePage } from './home/home'
import { LoginPage } from './login/login'
import { PasswordPage } from './login/password'
import { RegisterPage } from './login/register'

export class App extends React.Component<{}, {}> {

  loggedIn = true

  protect(targetPage, roles?: string[]) {
    return props => {
      if (!this.loggedIn) {
        this.loggedIn = true
        return <Redirect to="/login" />
      }
      return React.createElement(HomePage, Object.assign({}, props, props.match && props.match.params))
    }
  }

  render() {
    return <Switch>
      <Route path="/home" render={this.protect(HomePage)} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/auth-code" component={AuthCodePage} />
      <Route path="/password" component={PasswordPage} />
      <Route path="*" render={() => <Redirect to="/home" />} />
    </Switch>
  }
}
