import { AuthInfo } from './auth-info'

export interface User {
  id?: string
  name?: string
  picture?: string
  authInfo?: AuthInfo
}