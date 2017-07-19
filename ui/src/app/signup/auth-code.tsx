import * as React from 'react'

import { data, inject } from 'statex/react'

import { AppState } from '../../state/app-state'
import { Button } from '../../component/button'
import { Loader } from '../../component/index'
import { SetSignupStateAction } from '../../action/index'
import { TextInput } from '../../component/text-input'
import { VerifyAuthCodeAction } from '../../action/user-actions'

class Props {
  history?: string[]

  @data((state: AppState) => state.user.id)
  email?: string
}

interface State {
  authCode?: string
  loading?: boolean
  error?: {
    authCode?: string
  }
}

@inject(Props)
export class AuthCodePage extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: {}
    }
  }

  componentDidMount() {
    if (this.props.email == undefined) {
      new SetSignupStateAction('register').dispatch()
    }
  }

  render() {
    return <div className="flex flex-column flex-auto w-100 items-center justify-start">
      {this.state.loading && <Loader></Loader>}
      {!this.state.loading &&
        <div className="w-100">
          <div className="w-100 tc mt3">An email with the code has been sent to
          <div className="b"> {this.props.email}</div>
          </div>
          <form className="w-100">
            <TextInput type="text"
              id="authCode"
              autoFocus={true}
              placeholder="Enter auth code"
              error={this.state.error.authCode}
              onChange={event => this.setState({ authCode: event.target.value })}
            ></TextInput>
            <Button submit={true} className="w-100 mt3" onClick={event => this.verify(event)}>Verify</Button>
          </form>
        </div>}
    </div>
  }

  validate(): boolean {
    const error = {
      authCode: this.state.authCode == undefined || this.state.authCode.trim() === '' ? 'Required' :
        !/^[\d]{6,6}$/.test(this.state.authCode) ? 'Invalid authCode' : undefined
    }
    this.setState(state => ({
      error
    }))
    return Object.keys(error).filter(i => error[i] != undefined).length === 0
  }

  verify(event) {
    event.preventDefault()
    if (this.validate()) {
      Promise.resolve()
        .then(() => this.setState({ loading: true }))
        .then(() => new VerifyAuthCodeAction(this.props.email, this.state.authCode).dispatch())
        .then(() => {
          // do nothing
        }, error => {
          this.setState({ loading: false, error: { authCode: 'Incorrect code' } })
        })
    }
  }
}