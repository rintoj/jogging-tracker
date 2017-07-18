import * as React from 'react'

import { data, inject } from 'statex/react'

import { AppState } from '../../state/index'
import { Loader } from '../../component/index'
import { SignUpPageState } from '../../state/page-state'

// import { AuthCodePage } from './auth-code'
// import { PasswordPage } from './password'
// import { RegisterPage } from './register'

class Props {
  @data((state: AppState) => state.signupPageState)
  state?: SignUpPageState
}

interface State { }

@inject(Props)
export class SignUpPage extends React.Component<Props, State> {

  render() {
    return <div className="primary flex flex-column flex-auto w-100 vh-100 items-center justify-center">
      <div className="card pa4 ma4 shadow-3 br1 w-100 flex flex-column justify-start login-card">
        <div className="flex flex-column items-center justify-center">
          <img src={require('../../assets/img/logo.png')} alt="" className="w3 h3" />
          <div className="f3 tc mb4 ttu title-text b">Jog Tracker</div>
        </div>
        <Loader className="mt5"></Loader>
        {/* {this.props.state === 'loading' && <Loader></Loader>}
        {this.props.state === 'password' && <PasswordPage></PasswordPage>}
        {this.props.state === 'auth-code' && <AuthCodePage></AuthCodePage>}
        {(this.props.state === 'register' || this.props.state == undefined) &&
          <RegisterPage></RegisterPage>} */}
      </div>
    </div>
  }

}