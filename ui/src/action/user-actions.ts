import { Action } from 'statex'
import { SignUpPageState } from '../state/page-state'

export class AuthorizeAction extends Action {
  constructor(public onRedirect: Function) { super() }
}
export class SendAuthCodeAction extends Action {
  constructor(public email: string) { super() }
}
export class VerifyAuthCodeAction extends Action {
  constructor(public email: string, public code: string) { super() }
}
export class SetSignupStateAction extends Action {
  constructor(public state: SignUpPageState) { super() }
}
export class SetRedirectUrlAction extends Action {
  constructor(public redirectUrl?: string) { super() }
}
export class SignInAction extends Action {
  constructor(public userId: string, public password: string) { super() }
}
export class SignOutAction extends Action { }