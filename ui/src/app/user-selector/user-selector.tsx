import * as React from 'react'

import { FetchJogLogsAction, SelectUserAction } from '../../action/index'
import { IconText, Profile } from '../../component/index'
import { data, inject } from 'statex/react'

import { AppState } from '../../state'
import { Dialog } from '../../component/dialog/dialog'
import { FetchStatisticsAction } from '../../action/statistics-actions'
import { User } from '../../state/user'

class Props {
  @data((state: AppState) => state.selectedUser)
  selectedUser?: User

  @data((state: AppState) => state.users)
  users?: User[]
}

interface State {
  open?: boolean
}

@inject(Props)
export class UserSelector extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  render() {
    return <div className="flex items-center secondary justify-center pv3 ph4 user-selector-node">
      <div className="w-100 flex">
        <IconText icon="address-book" className="selected-user-node flex-auto ttu">
          {this.props.selectedUser && this.props.selectedUser.name}
        </IconText>
        <div className="switch-button ml3 flex ttu accent-text accent--hover pointer pa2 br1 items-center justify-center"
          onClick={event => this.open()}>
          Switch
      </div>
      </div>
      {this.state.open && <Dialog color="secondary" onClose={event => this.close()}>
        <div className="switch-users-page f3 w-100 pt4 ph4 pb3">Select a user</div>
        <div className="divider-l-br bb w-100"></div>
        <div className="flex flex-wrap overflow-hidden overflow-y-auto ph4 mt2" style={{ width: '300px', maxHeight: '200px' }}>
          {this.props.users.map(user => <Profile key={user.id}
            name={user.name}
            picture={user.picture}
            roles={user.authInfo.roles}
            onProfileClick={event => this.selectUser(user)}
          ></Profile>
          )}
        </div>
        <div className="accent-text tc pa4 ttu pointer" onClick={event => this.close()}>Close</div>
      </Dialog>}
    </div>
  }

  open() {
    this.setState({ open: true })
  }

  close() {
    this.setState({ open: false })
  }

  selectUser(user) {
    new SelectUserAction(user).dispatch()
      .then(() => new FetchJogLogsAction().dispatch())
      .then(() => new FetchStatisticsAction().dispatch())
    this.close()
  }
}