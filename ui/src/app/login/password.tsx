import * as React from 'react'

import { Button } from '../../component/button'
import { TextInput } from '../../component/text-input'

// import { Link } from 'react-router-dom'

interface Props {
  history?: string[]
  email?: string
}

interface State {
  password?: string
  confirmation?: string
  error?: {
    password?: string
    confirmation?: string
  }
}

export class PasswordPage extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      error: {}
    }
  }

  render() {
    return <div className="primary flex flex-column flex-auto w-100 vh-100 items-center justify-center">
      <div className="card pa4 ma4 shadow-3 br1 w-100 flex flex-column justify-center login-card">
        <div className="flex flex-column items-center justify-center">
          <img src={require('../../assets/img/logo.png')} alt="" className="w3 h3" />
          <div className="f3 tc mb4 ttu title-text b">Jog Logger</div>
        </div>
        <form className="w-100">
          <TextInput type="text"
            id="password"
            autoFocus={true}
            placeholder="Enter Password"
            error={this.state.error.password}
            onChange={event => this.setState({ password: event.target.value })}
          ></TextInput>
          <TextInput type="text"
            id="password"
            placeholder="Confirm Password"
            error={this.state.error.confirmation}
            onChange={event => this.setState({ confirmation: event.target.value })}
          ></TextInput>
          <Button submit={true} className="w-100 mt3" onClick={event => this.create(event)}>Create Account</Button>
        </form>
      </div>
    </div>
  }

  validate(): boolean {
    const error = {
      password: this.state.password == undefined || this.state.password.trim() === '' ? 'Required' :
        !/^[\d]{6,6}$/.test(this.state.password) ? 'Invalid password' : undefined,
      confirmation: this.state.confirmation == undefined || this.state.confirmation.trim() === '' ? 'Required' :
        !/^[\d]{6,6}$/.test(this.state.confirmation) ? 'Invalid password' :
          this.state.password !== this.state.confirmation ? 'Does not match' : undefined
    }
    this.setState(state => ({
      error
    }))
    return Object.keys(error).filter(i => error[i] != undefined).length === 0
  }

  create(event) {
    event.preventDefault()
    if (this.validate()) {
      this.props.history.push('/home')
    }
  }
}