import { JogLog } from './jog-log'
import { SignUpPageState } from './page-state'
import { User } from './user'

export interface AppState {
  jogLogs?: JogLog[]
  showForm?: boolean
  authInProgress?: boolean
  requestInProgress?: boolean
  user?: User
  draftUser?: User
  history?: string
  signupPageState?: SignUpPageState
}