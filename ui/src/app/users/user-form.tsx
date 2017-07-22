import * as React from 'react'

import { Button, TextInput } from '../../component/index'

import { Dialog } from '../../component/dialog/dialog'
import { SaveUserAction } from '../../action/index'
import { User } from '../../state/user'

interface Props {
  user?: User
  onClose?: Function
}
interface State {
  loading?: Boolean
  failed?: Boolean
  user?: User
  password?: string
  error?: {
    name?: string
    id?: string
    password?: string
  }
}

const ROLES = ['user', 'manager', 'admin']

export class UserForm extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      error: {},
      user: Object.assign({
        authInfo: {
          roles: ['user']
        }
      }, this.props.user)
    }
  }

  componentWillReceiveProps(props: Props) {
    this.props = props
    this.setState({ user: Object.assign({}, this.props.user) })
  }

  render() {
    return <Dialog onClose={event => this.close()}>
      <div className="flex flex-column pa4" style={{ width: '400px' }}>
        <div className="f2 divider-br bb mb4">{this.props.user ? 'Update' : 'Create a'} user</div>
        {this.state.failed && this.props.user != undefined ?
          <div className="error-text ttu mb3 tc">Failed! Try again</div>
          : this.state.failed && <div className="error-text ttu mb3 tc">User already exists.</div>}
        <TextInput label="Email Id"
          onChange={event => this.onIdChange(event)}
          error={this.state.error.id}
          disabled={this.props.user != undefined}
          autoFocus={this.props.user == undefined}
          value={this.state.user && this.state.user.id || ''}></TextInput>
        <TextInput label="Full Name"
          onChange={event => this.onNameChange(event)}
          error={this.state.error.name}
          autoFocus={this.props.user != undefined && this.state.user != undefined && this.state.user.name == undefined}
          value={this.state.user && this.state.user.name || ''}></TextInput>
        <TextInput label="Password" type="password"
          onChange={event => this.onPasswordChange(event)}
          error={this.state.error.password}
          autoFocus={this.state.user && this.state.user.id != undefined && this.state.user.name != undefined}></TextInput>
        <div className="b pv2 ttu f6">Role</div>
        <select value={this.state.user && this.state.user.authInfo && this.state.user.authInfo.roles[0]}
          className="input-reset divider-br br1 pv3 ph3 ttc"
          onClick={event => event.stopPropagation()}
          onChange={event => this.selectRole(event)}>
          {ROLES.map(role => <option key={role} value={role} className="ttc">{role}</option>)}
        </select>
        <div className="pt4 flex w-100 items-center justify-center">
          <Button className="mr2 ph4" onClick={event => this.submit(event)}>{this.props.user ? 'Save' : 'Create'}</Button>
          <Button className="ml2 ph4" color="secondary" onClick={event => this.close()}>Cancel</Button>
        </div>
      </div>
    </Dialog>
  }

  selectRole(event) {
    event.persist()
    this.setState(state => ({
      user: Object.assign({}, state.user, {
        authInfo: { roles: [ROLES[event.nativeEvent.target.selectedIndex]] }
      })
    }))
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

  validate(): boolean {
    const error = {
      id: this.state.user == undefined || this.state.user.id == undefined || this.state.user.id.trim() === '' ? 'Required' :
        !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(this.state.user.id) ? 'Invalid email' : undefined,
      name: this.state.user == undefined || this.state.user.name == undefined || this.state.user.name.trim() === '' ? 'Required' : undefined,
      password: this.state.password == undefined || this.state.password.trim() === '' ? undefined :
        !/^.{6,15}$/.test(this.state.password) ? 'Password must be 6 characters in length' : undefined
    }
    this.setState(state => ({
      error
    }))
    return Object.keys(error).filter(i => error[i] != undefined).length === 0
  }

  close() {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose()
    }
  }

  submit(event) {
    if (this.validate()) {
      Promise.resolve()
        .then(() => this.setState({ loading: true, failed: false }))
        .then(() => new SaveUserAction(this.state.user, this.state.password, this.props.user == undefined).dispatch())
        .then(() => this.setState({ loading: false }))
        .then(() => this.close())
        .catch(() => this.setState({ loading: false, failed: true }))
    }
  }
}