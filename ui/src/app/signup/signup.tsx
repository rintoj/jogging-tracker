import * as React from 'react'

import { Button, Loader, TextInput } from '../../component/index'
import { RegisterUserAction, SetRedirectUrlAction } from '../../action/index'

import { BrowserHistory } from 'react-router-dom'
import { User } from '../../state/user'

interface Props {
  history?: BrowserHistory
}

interface State {
  loading?: boolean
  success?: boolean
  failed?: boolean
  user?: User
  password?: string
  confirm?: string
  error?: {
    name?: string
    id?: string
    password?: string
    confirm?: string
  }
}

export class SignUpPage extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      error: {},
      user: Object.assign({
        authInfo: {
          roles: ['user']
        }
      })
    }
  }

  render() {
    return <div className="primary flex flex-column flex-auto w-100 vh-100 items-center justify-center">
      {!this.state.success && <form className="card pa4 ma4 shadow-3 br1 w-100 flex flex-column justify-start" style={{ width: '400px' }}>
        <div className="f2 divider-br bb mb4">Register</div>
        {this.state.failed && <div className="error-text ttu mb3 tc">User already exists.</div>}
        <TextInput label="Email Id"
          onChange={event => this.onIdChange(event)}
          error={this.state.error.id}
          disabled={this.state.loading}
          autoFocus={true}
          value={this.state.user && this.state.user.id || ''}></TextInput>
        <TextInput label="Full Name"
          onChange={event => this.onNameChange(event)}
          error={this.state.error.name}
          disabled={this.state.loading}
          value={this.state.user && this.state.user.name || ''}></TextInput>
        <TextInput label="Password" type="password"
          onChange={event => this.onPasswordChange(event)}
          error={this.state.error.password}
          disabled={this.state.loading}></TextInput>
        <TextInput label="Confirm" type="password"
          onChange={event => this.onConfirmChange(event)}
          error={this.state.error.confirm}
          disabled={this.state.loading}
          autoFocus={this.state.user && this.state.user.id != undefined && this.state.user.name != undefined}></TextInput>
        <div className="pt4 flex w-100 items-center justify-center">
          <Button submit={true} className="mr2 ph4 flex-auto" color="ternary" onClick={event => this.submit(event)}
            disabled={this.state.loading}>{this.state.loading ? <div className="flex items-center justify-center">
              <Loader></Loader>
            </div> : 'Signup'}
          </Button>
          <Button className="ml2 ph4 flex-auto" color="secondary" onClick={event => this.close()}>Cancel</Button>
        </div>
      </form>}
      {this.state.success && <div className="card pa4 ma4 tc shadow-3 br1 w-100 flex flex-column justify-center" style={{ width: '400px' }}>
        <div className="flex flex-column items-center justify-center">
          <img src={require('../../assets/img/logo.png')} alt="" className="w3 h3" />
          <div className="f3 tc mb4 ttu title-text b">Jog Tracker</div>
        </div>
        <div className="f2">User is registered</div>
        <div className="mt5 f4">Login with your email</div>
        <div className="mt2 mb4 f4 b">{this.state.user.id}</div>
        <div className="pt4 flex w-100 items-center justify-center">
          <Button className="flex-auto" onClick={event => this.gotoSignIn(event)}>SignIn</Button>
        </div>
      </div>}
    </div>
  }

  onIdChange(event) {
    event.persist()
    this.setState(state => ({
      user: Object.assign({}, state.user, {
        id: event.target.value
      })
    }))
  }

  onNameChange(event) {
    event.persist()
    this.setState(state => ({
      user: Object.assign({}, state.user, {
        name: event.target.value
      })
    }))
  }

  onPasswordChange(event) {
    event.persist()
    this.setState(state => ({
      password: event.target.value
    }))
  }

  onConfirmChange(event) {
    event.persist()
    this.setState(state => ({
      confirm: event.target.value
    }))
  }

  validate(): boolean {
    const error = {
      id: this.state.user == undefined || this.state.user.id == undefined || this.state.user.id.trim() === '' ? 'Required' :
        !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(this.state.user.id) ? 'Invalid email' : undefined,
      name: this.state.user == undefined || this.state.user.name == undefined || this.state.user.name.trim() === '' ? 'Required' : undefined,
      password: this.state.password == undefined || this.state.password.trim() === '' ? 'Required' :
        !/^.{6,15}$/.test(this.state.password) ? 'Password must be 6 characters in length' : undefined,
      confirm: this.state.confirm == undefined || this.state.confirm.trim() === '' ? 'Required' :
        this.state.confirm !== this.state.password ? 'Don\'t  match!' : undefined
    }
    this.setState(state => ({
      error
    }))
    return Object.keys(error).filter(i => error[i] != undefined).length === 0
  }

  close() {
    this.props.history.replace('/')
  }

  gotoSignIn(event) {
    Promise.resolve()
      .then(() => new SetRedirectUrlAction('/').dispatch())
      .then(() => this.props.history.replace('/signin'))
  }

  submit(event) {
    event.preventDefault()
    if (this.validate()) {
      Promise.resolve()
        .then(() => this.setState({ loading: true, failed: false, success: false }))
        .then(() => new RegisterUserAction(this.state.user, this.state.password).dispatch())
        .then(() => this.setState({ loading: false, success: true }))
        .catch((error) => {
          console.error(error)
          this.setState({ loading: false, failed: true })
        })
    }
  }
}