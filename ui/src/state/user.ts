import { AuthInfo } from './auth-info'

export interface User {
  id?: string
  name?: string
  firstName?: string
  lastName?: string
  picture?: string
  authInfo?: AuthInfo
}