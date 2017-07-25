import * as React from 'react'

import { Button, Profile, Table, TextInput } from '../../component/index'
import { FetchJogLogsAction, RemoveUserAction } from '../../action/index'
import { data, inject } from 'statex/react'

import { AppState } from '../../state/app-state'
import { BrowserHistory } from 'react-router-dom'
import { Page } from '../page/page'
import { User } from '../../state/user'
import { UserForm } from './user-form'

class Props {
  history?: BrowserHistory

  @data((state: AppState) => state.requestInProgress)
  requestInProgress?: boolean

  @data((state: AppState) => state.users)
  users?: User[]
}

interface State {
  filter?: RegExp
  showUserForm?: boolean
  selectedUser?: User
}

const columns = [
  {
    name: 'User',
    sort: true,
    sortable: true,
    formatter: (value) => <Profile color="secondary-text" name={value[0]} picture={value[1]}></Profile>
  }, {
    name: 'id',
    sortable: true
  }, {
    name: 'Roles',
    sortable: true,
    formatter: (value) => <div className="ttc">{value}</div>
  }, {
    name: '',
    className: 'tc w2',
    formatter: (value, rows) => <div className="w-100 ">
      <div className="fa f2 o-60 glow error-text fa-times-circle pointer" onClick={(event) => {
        event.stopPropagation()
        new RemoveUserAction(rows[1]).dispatch()
      }}></div>
    </div>
  }
]

@inject(Props)
export class UsersPage extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    new FetchJogLogsAction().dispatch()
  }

  toRow(user: User): any[] {
    return [
      [user.name, user.picture],
      user.id,
      user.authInfo.roles[0],
      ''
    ]
  }

  render() {
    const rows = (this.props.users || [])
      .filter(user => this.state.filter == undefined || this.state.filter.test(user.id) || this.state.filter.test(user.name))
      .map(user => this.toRow(user))

    return <Page history={this.props.history}>
      <div className="pa4 w-100 vh-100 overflow-y-auto">
        <div className="f2 mb3">Users</div>
        {this.state.showUserForm && <UserForm user={this.state.selectedUser}
          onClose={event => this.closeUserForm(event)}></UserForm>}
        <div className="flex mb3">
          <form className="flex w-100">
            <TextInput type="text"
              placeholder="Search for name or id"
              style={{ width: '500px' }}
              onChange={event => this.onChange(event)}
            ></TextInput>
            <div className="flex-auto"></div>
            <div className="pv2">
              <Button className="ph4" onClick={event => this.openUserForm(event)}>Create User</Button>
            </div>
          </form>
        </div>
        <Table columns={columns} rows={rows} showIndex={true} loading={this.props.requestInProgress}
          onClickRow={event => this.selectUser(event)}></Table>
      </div>
    </Page>
  }

  onChange(event) {
    this.setState({ filter: new RegExp(event.target.value, 'ig') })
  }

  selectUser(event) {
    const selectedUser = this.props.users.find(user => user.id === event[1])
    this.setState({ showUserForm: true, selectedUser })
  }

  openUserForm(event) {
    this.setState({ showUserForm: true, selectedUser: undefined })
  }

  closeUserForm(event) {
    this.setState({ showUserForm: false })
  }

}