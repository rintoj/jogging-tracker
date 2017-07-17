import * as React from 'react'

import { Button } from '../../component/button'
import { Link } from 'react-router-dom'
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

export class LoginPage extends React.Component<Props, State> {

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
          <div className="f3 tc mb4 ttu title-text b">Jog Logger</div>
        </div>
        <form>
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
            <Link to="/register" className="flex-auto flex" >
              <Button className="ml2 flex-auto" color="secondary">Sign Up</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  }

  validate(): boolean {
    const error = {
      userId: this.state.userId == null || this.state.userId.trim() === '' ? 'Required' :
        !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(this.state.userId) ? 'Invalid email' : undefined,
      password: this.state.password == null || this.state.password.trim() === '' ? 'Required' : undefined
    }
    this.setState(state => ({
      error
    }))
    return Object.keys(error).filter(i => error[i] != null).length === 0
  }

  signIn(event) {
    event.preventDefault()
    if (this.validate()) {
      this.props.history.push(`/home`)
    }
  }
}