import * as React from 'react'

import { Button } from '../../component/button'
import { TextInput } from '../../component/text-input'

interface Props {
  history?: string[]
  email?: string
}

interface State {
  authCode?: string
  error?: {
    authCode?: string
  }
}

export class AuthCodePage extends React.Component<Props, State> {

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
          <div className="f3 tc mb4 ttu title-text b">Jog Tracker</div>
        </div>
        <div className="w-100 tc mt3">An email with the code has been sent to
          <div className="b"> {this.props.email || ' rintoj@gmail.com'}</div>
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
      </div>
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
      this.props.history.push('/password')
    }
  }
}