import * as React from 'react'

import { Button } from '../../component/button'
import { TextInput } from '../../component/text-input'

// import { Link } from 'react-router-dom'

interface Props {
  history?: string[]
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
    return <div className="primary flex flex-column flex-auto w-100 vh-100 items-center justify-center">
      <div className="card pa4 ma4 shadow-3 br1 w-100 flex flex-column justify-around login-card">
        <div className="flex flex-column items-center justify-center">
          <img src={require('../../assets/img/logo.png')} alt="" className="w3 h3" />
          <div className="f3 tc mb4 ttu title-text b">Jog Tracker</div>
        </div>
        <Button className="w-100" color="ternary">Sign up with Google</Button>
        <div className="w-100 tc mt3">or</div>
        <form className="w-100">
          <TextInput type="text"
            id="email"
            autoFocus={true}
            placeholder="Enter your email ID"
            error={this.state.error.email}
            onChange={event => this.setState({ email: event.target.value })}
          ></TextInput>
          <Button submit={true} className="w-100 mt3" onClick={event => this.signUp(event)}>Sign Up</Button>
        </form>
      </div>
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
      this.props.history.push('/auth-code')
    }
  }
}