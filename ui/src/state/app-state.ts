import { Filters } from './filters'
import { JogLog } from './jog-log'
import { SignUpPageState } from './page-state'
import { Statistics } from './statistics'
import { User } from './user'

export interface AppState {
  jogLogs?: JogLog[]
  filters?: Filters
  statistics?: Statistics
  showForm?: boolean
  authInProgress?: boolean
  requestInProgress?: boolean
  user?: User
  draftUser?: User
  history?: string
  signupPageState?: SignUpPageState
}