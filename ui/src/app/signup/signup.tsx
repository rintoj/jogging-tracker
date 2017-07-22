import * as React from 'react'

import { data, inject } from 'statex/react'

import { AppState } from '../../state/index'
import { AuthCodePage } from './auth-code'
import { BrowserHistory } from 'react-router-dom'
import { Loader } from '../../component'
import { RegisterPage } from './register'
import { SignUpPageState } from '../../state/page-state'

class Props {
  history?: BrowserHistory

  @data((state: AppState) => state.signupPageState)
  state?: SignUpPageState
}

interface State {
  email?: string
}

@inject(Props)
export class SignUpPage extends React.Component<Props, State> {

  render() {
    return <div className="primary flex flex-column flex-auto w-100 vh-100 items-center justify-center">
      <div className="card pa4 ma4 shadow-3 br1 w-100 flex flex-column justify-start login-card">
        <div className="flex flex-column items-center justify-center pointer "
          onClick={event => this.goHome()}>
          <img src={require('../../assets/img/logo.png')} alt="" className="w3 h3" />
          <div className="f3 tc mb4 ttu title-text b">Jog Tracker</div>
        </div>
        {this.props.state === 'loading' && <Loader className="mt6"></Loader>}
        {(this.props.state === 'register' || this.props.state === 'forgot' || this.props.state == undefined) &&
          <RegisterPage forgot={this.props.state === 'forgot'}
            onEmailChange={email => this.setState({ email })}></RegisterPage>}
        {this.props.state === 'auth-code' && <AuthCodePage email={this.state.email}></AuthCodePage>}
      </div>
    </div>
  }

  goHome() {
    this.props.history.push('/home')
  }

}