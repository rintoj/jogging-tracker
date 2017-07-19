import * as React from 'react'

import { SetSignupStateAction, SignInAction } from '../../action'

import { Button } from '../../component/button'
import { TextInput } from '../../component/text-input'

// import { Link } from 'react-router-dom'

interface Props {
  history?: string[]
}

interface State {
  userId?: string
  password?: string
  error?: {
    userId?: string
    password?: string
  }
}

export class LoginForm extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      error: {}
    }
  }

  render() {
    return <form>
      <div className="tc mb4 ttu title-text b">Sign In with your Jog Tracker account</div>
      <TextInput type="text"
        id="userId"
        placeholder="Enter your email id"
        error={this.state.error.userId}
        autoFocus={true}
        onChange={event => this.setState({ userId: event.target.value })}
      ></TextInput>
      <TextInput type="password"
        id="password"
        placeholder="Enter your password"
        error={this.state.error.password}
        onChange={event => this.setState({ password: event.target.value })}
      ></TextInput>
      <div className="flex mt4">
        <Button submit={true} className="flex-auto mr2" onClick={event => this.signIn(event)}>Sign In</Button>
        <Button className="ml2 flex-auto" color="secondary" onClick={event => this.signUp(event)}>Sign Up</Button>
      </div>
    </form>
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
      new SignInAction(this.state.userId, this.state.password).dispatch()
    }
  }
}