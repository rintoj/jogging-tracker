import * as React from 'react'

import { SetRedirectUrlAction, SignOutAction } from '../../action/index'
import { data, inject } from 'statex/react'

import { AppState } from '../../state/index'
import { BrowserHistory } from 'react-router-dom'
import { Button } from '../../component'
import { Loader } from '../../component'
import { User } from '../../state/user'

class Props {
  history?: BrowserHistory

  @data((state: AppState) => state.draftUser)
  draftUser?: User

  @data((state: AppState) => state.user)
  user?: User
}

interface State {
  loading?: boolean
}

@inject(Props)
export class ProfilePage extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = { loading: true }
  }

  componentWillMount() {
    setTimeout(() => {
      if (this.props.user == undefined && this.props.draftUser == undefined) {
        this.props.history.push('/signin')
      }
      this.setState({ loading: false })
    }, 500)
  }

  render() {
    const user = this.props.user || {}
    return <div className="primary flex flex-column flex-auto w-100 vh-100 items-center justify-center">
      <div className="card pa4 ma4 shadow-3 br1 w-100 flex flex-column justify-around login-card">
        {this.state.loading && <Loader className="mt5"></Loader>}
        {!this.state.loading && <div className="flex flex-column items-center justify-center flex-auto">
          <div className="flex-auto"></div>
          <div className="flex flex-column items-center justify-center">
            {user.picture != undefined && user.picture !== '' && user.picture !== 'undefined' ?
              <img src={user.picture} alt="" className="w4 h4 br-100 divider-l" /> :
              <div className="br-100 w4 h4 ttu flex f2 items-center justify-center ternary">
                {(user.name || 'UR').substr(0, 2)}
              </div>}
            <div className="f3 b tc title-text mt3">{user.name}</div>
            <div className="mt2">{user.id}</div>
            <div className="ttu tc title-text mt2">{(user.authInfo ? user.authInfo.roles : (user as any).roles)}</div>
          </div>
          <div className="flex-auto"></div>
          <div className="flex flex-around w-100">
            <Button submit={true} color="accent" className="w-100 mt4 mr2"
              onClick={event => this.signOut(event)}>Sign Out</Button>
            <Button submit={true} color="secondary" className="w-100 mt4 ml2"
              onClick={event => this.goHome(event)}>Go Home</Button>
          </div>
        </div>}
      </div>
    </div>
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

}