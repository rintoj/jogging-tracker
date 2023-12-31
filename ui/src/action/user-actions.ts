import { Action } from 'statex'
import { User } from './../state/user'

export class AuthorizeAction extends Action { constructor(public onRedirect: Function) { super() } }
export class SetRedirectUrlAction extends Action { constructor(public redirectUrl?: string) { super() } }
export class SignInAction extends Action { constructor(public userId: string, public password: string) { super() } }
export class SignOutAction extends Action { }
export class FetchUsersAction extends Action { }
export class SelectUserAction extends Action { constructor(public user: User) { super() } }
export class RemoveUserAction extends Action { constructor(public id: string) { super() } }
export class RegisterUserAction extends Action { constructor(public user: User, public password: string) { super() } }
export class SaveUserAction extends Action { constructor(public user: User, public password: string, public createOnly?: boolean) { super() } }