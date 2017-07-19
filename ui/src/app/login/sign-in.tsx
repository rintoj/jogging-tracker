import * as React from 'react'

import { data, inject } from 'statex/react'

import { AppState } from '../../state/app-state'
import { Loader } from '../../component/index'
import { LoginForm } from './login-form'

class Props {
  history?: string[]

  @data((state: AppState) => state.authInProgress)
  authInProgress?: boolean
}

interface State {
  userId?: string
  password?: string
  error?: {
    userId?: string
    password?: string
  }
}

@inject(Props)
export class SignInPage extends React.Component<Props, State> {

  render() {
    return <div className="primary flex flex-column flex-auto w-100 vh-100 items-center justify-center">
      <div className="card pa4 ma4 shadow-3 br1 w-100 flex flex-column justify-start login-card">
        <div className="flex flex-column items-center justify-center">
          <img src={require('../../assets/img/logo.png')} alt="" className="w3 h3" />
          <div className="f3 tc mb4 ttu title-text b">Jog Tracker</div>
        </div>
        {this.props.authInProgress && <Loader className="mt5"></Loader>}
        {!this.props.authInProgress && <LoginForm history={this.props.history}></LoginForm>}
      </div>
    </div>
  }

}