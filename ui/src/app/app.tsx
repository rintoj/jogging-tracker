import '../store'

import * as React from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'

import { HomePage } from './home/home'

export class App extends React.Component<{}, {}> {
  render() {
    return <Switch>
      <Route path="/home" component={HomePage} />
      <Route path="*" render={() => <Redirect to="/home" />} />
    </Switch>
  }
}
