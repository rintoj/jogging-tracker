import '../store'

import * as React from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'

import { AuthorizeAction } from '../action/index'
import { AuthorizePage } from './signup/authorize'
import { HomePage } from './home/home'
import { SetRedirectUrlAction } from '../action/user-actions'
import { SignInPage } from './login/sign-in'
import { SignUpPage } from './signup/signup'

interface Props {
  history?: string[]
}

export class App extends React.Component<Props, {}> {

  private authenticated: boolean

  componentDidMount() {
    new SetRedirectUrlAction(location.pathname).dispatch()
    new AuthorizeAction((redirectUrl, authenticated) => {
      this.authenticated = authenticated
      if (location.pathname !== redirectUrl) {
        this.props.history.push(redirectUrl)
      }
    }).dispatch()
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
    return <Switch>
      <Route path="/home" render={this.protect(HomePage)} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/authorize" component={AuthorizePage} />
      <Route path="*" render={() => <Redirect to="/home" />} />
    </Switch>
  }
}
