import { action, store } from 'statex/react'

import { AppState } from './../state/app-state'
import { AuthorizeAction } from './../action/user-actions'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { SendAuthCodeAction } from './../action/user-actions'
import { SetRedirectUrlAction } from '../action/index'
import { SetSignupStateAction } from '../action/index'
import { SignOutAction } from '../action/index'
import { User } from './../state/user'
import { VerifyAuthCodeAction } from '../action/index'
import { services } from './../service/index'

const REDIRECT_URL_KEY = 'redirect_url'

@store()
export class UserStore {

  private _redirectUrl: string
  private onRedirect: Function

  get redirectUrl() {
    return this.validateUrl(this._redirectUrl ||
      (this._redirectUrl = localStorage.getItem(REDIRECT_URL_KEY) || 'home'))
  }

  set redirectUrl(url: string) {
    this._redirectUrl = url
    if (url != undefined) {
      localStorage.setItem(REDIRECT_URL_KEY, this._redirectUrl)
    }
  }

  validateUrl(url: string): string {
    if (url === '/authorize') {
      if (services.authService.getSession() == undefined) {
        return '/signin'
      } {
        return '/home'
      }
    }
    return url
  }

  @action()
  authorize(state: AppState, authorizeAction: AuthorizeAction): Observable<AppState> {
    this.onRedirect = authorizeAction.onRedirect
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ authInProgress: true })
      services.authService.handleAuthentication((error, user: User) => {
        observer.next({ authInProgress: false })
        if (error) {
          if (this.redirectUrl === '/signin') {
            this.onRedirect(this.redirectUrl, false)
          }
          return observer.next({ user: undefined })
        }
        observer.next({ user })
        this.onRedirect(this.redirectUrl, services.authService.isAuthenticated(user && user.authInfo))
      })
    })
  }

  @action()
  setRedirectUrl(state: AppState, setRedirectUrlAction: SetRedirectUrlAction): AppState {
    this.redirectUrl = setRedirectUrlAction.redirectUrl

    return state
  }

  @action()
  sendAuthCode(state: AppState, sendAuthCodeAction: SendAuthCodeAction): Promise<AppState> {
    return services.authService.requestAuthCode(sendAuthCodeAction.email)
      .then(() => Object.assign({}, state, {
        user: { email: sendAuthCodeAction.email }
      }), error => error)
  }

  @action()
  setSignupPageState(state: AppState, setSignupPageStateAction: SetSignupStateAction): AppState {
    return { signupPageState: setSignupPageStateAction.state }
  }

  @action()
  verifyAuthCode(state: AppState, verifyAuthCodeAction: VerifyAuthCodeAction): Promise<AppState> {
    return services.authService.verifyAuthCode(verifyAuthCodeAction.email, verifyAuthCodeAction.code)
      .then(() => state, error => error)
  }

  @action()
  signOut(state: AppState, signOutAction: SignOutAction): AppState {
    services.authService.signOut()
    return state
  }

}