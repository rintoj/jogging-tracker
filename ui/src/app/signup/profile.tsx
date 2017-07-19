import * as React from 'react'

import { SaveProfileAction, SetRedirectUrlAction, SignInAction } from '../../action/index'
import { data, inject } from 'statex/react'

import { AppState } from '../../state/index'
import { Button } from '../../component/button'
import { Loader } from '../../component/index'
import { TextInput } from '../../component/text-input'
import { User } from '../../state/user'

class Props {
  history?: string[]

  @data((state: AppState) => state.draftUser)
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
      name: (this.props.user || {}).name,
      loading: true,
      failed: false,
      error: {}
    }
  }

  componentWillMount() {
    setTimeout(() => {
      if (this.props.user == undefined) {
        this.props.history.push('/signup')
      }
      this.setState({ loading: false })
    }, 100)
  }

  render() {
    const user = this.props.user || {}
    return <div className="primary flex flex-column flex-auto w-100 vh-100 items-center justify-center">
      <div className="card pa4 ma4 shadow-3 br1 w-100 flex flex-column justify-start login-card">
        <div className="flex flex-column items-center justify-center">
          <img src={user.picture} alt="" className="w4 h4 br-100 divider-l" />
          <div className="mt3">{user.id}</div>
        </div>
        {this.state.failed && <div className="error-text ttu mt3 tc">Something went wrong. Try again</div>}
        {this.state.loading && <Loader className="mt4"></Loader>}
        {!this.state.loading && <form className="mt2 w-100">
          <TextInput type="text"
            id="name"
            autoFocus={true}
            placeholder="Your Full Name"
            error={this.state.error.name}
            onChange={event => this.setState({ name: event.target.value })}
          ></TextInput>
          <TextInput type="password"
            id="password"
            placeholder="Enter Password"
            error={this.state.error.password}
            onChange={event => this.setState({ password: event.target.value })}
          ></TextInput>
          <Button submit={true} className="w-100 mt3" onClick={event => this.create(event)}>Create Account</Button>
        </form>}
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

  create(event) {
    event.preventDefault()
    if (this.validate()) {
      const user = Object.assign({}, this.props.user, { name: this.state.name })
      this.setState({ loading: true, failed: false })
      new SaveProfileAction(user, this.state.password).dispatch()
        .then(() => new SetRedirectUrlAction('/home').dispatch())
        .then(() => new SignInAction(user.id, this.state.password).dispatch())
        .then(() => this.setState({ loading: false }))
        .catch(error => this.setState({ loading: false, failed: true }))
    }
  }
}