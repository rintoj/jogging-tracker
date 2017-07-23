import * as React from 'react'

import { SaveProfileAction, SetRedirectUrlAction, SignInAction, SignOutAction } from '../../action/index'
import { data, inject } from 'statex/react'

import { AppState } from '../../state/index'
import { BrowserHistory } from 'react-router-dom'
import { Button } from '../../component'
import { Loader } from '../../component'
import { TextInput } from '../../component'
import { User } from '../../state/user'

class Props {
  history?: BrowserHistory

  @data((state: AppState) => state.draftUser)
  draftUser?: User

  @data((state: AppState) => state.user)
  user?: User
}

interface State {
  name?: string
  password?: string
  loading?: boolean
  failed?: boolean
  error?: {
    name?: string
    password?: string
  }
}

@inject(Props)
export class ProfilePage extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      failed: false,
      error: {}
    }
  }

  get name() {
    return this.state.name || this.user.name || ''
  }

  get user(): User {
    return this.props.draftUser || this.props.user || {}
  }

  get editable() {
    return this.props.draftUser != undefined
  }

  componentWillMount() {
    setTimeout(() => {
      if (this.props.user == undefined && this.props.draftUser == undefined) {
        this.props.history.push('/signin')
      }
      this.setState({ loading: false, name: this.user.name })
    }, 1000)
  }

  render() {
    return <div className="primary flex flex-column flex-auto w-100 vh-100 items-center justify-center">
      <div className="card pa4 ma4 shadow-3 br1 w-100 flex flex-column justify-around login-card">
        <div className="flex flex-column items-center justify-center">
          <img src={this.user.picture} alt="" className="w4 h4 br-100 divider-l" />
          <div className="f3 b tc title-text mt3">{this.user.name}</div>
          <div className="mt2">{this.user.id}</div>
          <div className="ttu tc title-text mt2">{(this.user.authInfo ? this.user.authInfo.roles : (this.user as any).roles)}</div>
        </div>
        {this.state.failed && <div className="error-text ttu mt3 tc">Something went wrong. Try again</div>}
        {this.state.loading && <Loader className="mt5"></Loader>}
        {!this.state.loading && this.editable && <form className="mt2 w-100">
          <TextInput type="text"
            id="name"
            autoFocus={true}
            placeholder="Your Full Name"
            value={this.state.name || ''}
            disabled={!this.editable}
            error={this.state.error.name}
            onChange={event => this.setState({ name: event.target.value })}
          ></TextInput>
          <TextInput type="password"
            id="password"
            placeholder="Enter Password"
            disabled={!this.editable}
            error={this.state.error.password}
            onChange={event => this.setState({ password: event.target.value })}
          ></TextInput>
          <Button submit={true} className="w-100 mt3"
            onClick={event => this.create(event)}>
            {this.props.user || (this.props.draftUser && this.props.draftUser.name != undefined)
              ? 'Update Profile' : 'Create Profile'}
          </Button>
        </form>}
        {!this.state.loading && !this.editable && <div className="flex flex-around w-100">
          <Button submit={true} color="accent" className="w-100 mt4 mr2"
            onClick={event => this.signOut(event)}>Sign Out</Button>
          <Button submit={true} color="secondary" className="w-100 mt4 ml2"
            onClick={event => this.goHome(event)}>Go Home</Button>
        </div>}
      </div>
    </div>
  }

  validate(): boolean {
    const error = {
      name: this.state.name == undefined || this.state.name.trim() === '' ? 'Required' :
        !/^.+\s+.+$/.test(this.state.name) ? 'Invalid name' : undefined,
      password: this.state.password == undefined || this.state.password.trim() === '' ? 'Required' :
        !/^.{6,15}$/.test(this.state.password) ? 'Password must be 6 characters in length' : undefined
    }
    this.setState(state => ({
      error
    }))
    return Object.keys(error).filter(i => error[i] != undefined).length === 0
  }

  signOut(event) {
    event.preventDefault()
    Promise.resolve()
      .then(() => new SetRedirectUrlAction('/').dispatch())
      .then(() => new SignOutAction().dispatch())
      .then(() => this.props.history.replace('/'))
  }

  goHome(event) {
    event.preventDefault()
    this.props.history.push('/')
  }

  create(event) {
    event.preventDefault()
    if (this.validate()) {
      const user = Object.assign({}, this.user, { name: this.state.name })
      this.setState({ loading: true, failed: false })
      new SaveProfileAction(user, this.state.password).dispatch()
        .then(() => new SetRedirectUrlAction('/').dispatch())
        .then(() => new SignInAction(user.id, this.state.password).dispatch())
        .catch(error => {
          console.error(error)
          this.setState({ loading: false, failed: true })
        })
    }
  }
}