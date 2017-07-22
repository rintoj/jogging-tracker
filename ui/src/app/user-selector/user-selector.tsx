import * as React from 'react'

import { IconText, Profile } from '../../component/index'
import { data, inject } from 'statex/react'

import { AppState } from '../../state'
import { Dialog } from '../../component/dialog/dialog'
import { SelectUserAction } from '../../action/index';
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
    return <div className="flex items-center secondary justify-center pv3 ph4">
      <div className="w-100 flex">
        <IconText icon="address-book" className="flex-auto">{this.props.selectedUser && this.props.selectedUser.name}</IconText>
        <div className="ml3 flex ttu accent-text accent--hover pointer pa2 br1 items-center justify-center"
          onClick={event => this.open()}>
          Switch
      </div>
      </div>
      {this.state.open && <Dialog color="secondary" onClose={event => this.close()}>
        <div className="f3 w-100 pt4 ph4 pb3">Select a user</div>
        <div className="divider-l-br bb w-100"></div>
        <div className="flex flex-wrap overflow-hidden overflow-y-auto ph4 mt2" style={{ width: '300px', maxHeight: '200px' }}>
          {this.props.users.map(user => <Profile name={user.name}
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
    this.close()
  }
}