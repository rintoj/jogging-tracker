import { Action } from 'statex'
import { SignUpPageState } from '../state/page-state'

export class AuthorizeAction extends Action { }
export class SendAuthCodeAction extends Action { constructor(public email: string) { super() } }
export class SetSignupStateAction extends Action { constructor(public state: SignUpPageState) { super() } }