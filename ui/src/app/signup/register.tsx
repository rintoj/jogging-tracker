import * as React from 'react'

import { SendAuthCodeAction, SetSignupStateAction } from '../../action'

import { BrowserHistory } from 'react-router-dom'
import { Button } from '../../component'
import { IconText } from '../../component'
import { TextInput } from '../../component'

// import { Link } from 'react-router-dom'

interface Props {
  history?: BrowserHistory
  forgot?: boolean
  onEmailChange: Function
}

interface State {
  email?: string
  error?: {
    email?: string
  }
}

export class RegisterPage extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      error: {}
    }
  }

  render() {
    return <div className="flex flex-column justify-around">
      <Button className="w-100 mv3" color="ternary">
        <div className="w-100 flex justify-center">
          <IconText icon="google">{this.props.forgot ? 'Verify' : 'Sign up'} with Google</IconText>
        </div>
      </Button>
      <div className="w-100 tc mt3">or</div>
      <form className="w-100">
        <TextInput type="text"
          id="email"
          autoFocus={true}
          placeholder="Enter your email ID"
          error={this.state.error.email}
          onChange={event => this.setState({ email: event.target.value })}
        ></TextInput>
        <Button submit={true} className="w-100 mt3" onClick={event => this.signUp(event)}>
          {this.props.forgot ? 'Verify' : 'Sign Up'}</Button>
      </form>
    </div>
  }

  validate(): boolean {
    const error = {
      email: this.state.email == undefined || this.state.email.trim() === '' ? 'Required' :
        !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(this.state.email) ? 'Invalid email' : undefined
    }
    this.setState(state => ({
      error
    }))
    return Object.keys(error).filter(i => error[i] != undefined).length === 0
  }

  signUp(event) {
    event.preventDefault()
    if (this.validate()) {
      Promise.resolve()
        .then(() => new SetSignupStateAction('loading').dispatch())
        .then(() => new SendAuthCodeAction(this.state.email).dispatch())
        .then(() => this.props.onEmailChange(this.state.email))
        .then(() => new SetSignupStateAction('auth-code').dispatch())
        .catch(() => new SetSignupStateAction('register').dispatch())
    }
  }
}