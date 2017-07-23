import { Filters } from './filters'
import { JogLog } from './jog-log'
import { Statistics } from './statistics'
import { User } from './user'

export interface AppState {
  jogLogs?: JogLog[]
  filters?: Filters
  statistics?: Statistics
  selectedJogLog?: JogLog
  showForm?: boolean
  authInProgress?: boolean
  requestInProgress?: boolean
  user?: User
  users?: User[]
  selectedUser?: User
  draftUser?: User
  history?: string
}