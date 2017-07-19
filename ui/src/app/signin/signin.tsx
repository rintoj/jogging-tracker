import * as React from 'react'

import { SetSignupStateAction, SignInAction } from '../../action'
import { data, inject } from 'statex/react'

import { AppState } from '../../state/app-state'
import { Button } from '../../component/button'
import { Loader } from '../../component/index'
import { TextInput } from '../../component/text-input'

class Props {
  history?: string[]

  @data((state: AppState) => state.authInProgress)
  authInProgress?: boolean = true
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

  constructor(props) {
    super(props)
    this.state = {
      error: {}
    }
  }

  render() {
    return <div className="primary flex flex-column flex-auto w-100 vh-100 items-center justify-center">
      <div className="card pa4 ma4 shadow-3 br1 w-100 flex flex-column justify-start login-card">
        <div className="flex flex-column items-center justify-center">
          <img src={require('../../assets/img/logo.png')} alt="" className="w3 h3" />
          <div className="f3 tc mb4 ttu title-text b">Jog Tracker</div>
        </div>
        {this.props.authInProgress && <Loader className="mt5"></Loader>}
        {!this.props.authInProgress && <form>
          <div className="tc mb4 ttu title-text b">Sign In with your Jog Tracker account</div>
          <TextInput type="text"
            id="userId"
            placeholder="Enter your email id"
            value={this.state.userId || ''}
            error={this.state.error.userId}
            autoFocus={this.state.userId == undefined}
            onChange={event => this.setState({ userId: event.target.value })}
          ></TextInput>
          <TextInput type="password"
            id="password"
            autoFocus={this.state.userId != undefined}
            placeholder="Enter your password"
            error={this.state.error.password}
            onChange={event => this.setState({ password: event.target.value })}
          ></TextInput>
          <div className="flex mt4">
            <Button submit={true} className="flex-auto mr2" onClick={event => this.signIn(event)}>Sign In</Button>
            <Button className="ml2 flex-auto" color="secondary" onClick={event => this.signUp(event)}>Sign Up</Button>
          </div>
        </form>}
      </div>
    </div>
  }

  validate(): boolean {
    const error = {
      userId: this.state.userId == undefined || this.state.userId.trim() === '' ? 'Required' :
        !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(this.state.userId) ? 'Invalid email' : undefined,
      password: this.state.password == undefined || this.state.password.trim() === '' ? 'Required' : undefined
    }
    this.setState(state => ({
      error
    }))
    return Object.keys(error).filter(i => error[i] != undefined).length === 0
  }

  signUp(event) {
    event.preventDefault()
    Promise.resolve()
      .then(() => new SetSignupStateAction('register').dispatch())
      .then(() => this.props.history.push(`/signup`))
  }

  signIn(event) {
    event.preventDefault()
    if (this.validate()) {
      Promise.resolve()
        .then(() => new SignInAction(this.state.userId, this.state.password).dispatch())
        .catch(error => this.setState({
          error: { password: 'Sorry, we could not authorize your email id or password' }
        }))
    }
  }

}