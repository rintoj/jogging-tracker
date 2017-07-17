import '../store'

import * as React from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'

import { HomePage } from './home/home'
import { LoginPage } from './login/login'

export class App extends React.Component<{}, {}> {

  loggedIn = false

  protect(targetPage, props) {
    if (!this.loggedIn) {
      this.loggedIn = true
      return <Redirect to="/login" />
    }
    return React.createElement(HomePage, Object.assign({}, props, props.match && props.match.params))
  }

  render() {
    return <Switch>
      <Route path="/home" render={props => this.protect(HomePage, props)} />
      <Route path="/login" component={LoginPage} />
      <Route path="*" render={() => <Redirect to="/home" />} />
    </Switch>
  }
}
