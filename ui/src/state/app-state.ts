import { SignUpPageState } from './page-state'
import { User } from './user'

export interface AppState {
  authInProgress?: boolean
  user?: User,
  signupPageState?: SignUpPageState
}