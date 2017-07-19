import { SaveProfileAction, SignOutAction } from '../action/index'
import { SignInAction, VerifyAuthCodeAction } from '../action/index'
import { action, store } from 'statex/react'

import { AppState } from './../state/app-state'
import { AuthorizeAction } from './../action/user-actions'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { SendAuthCodeAction } from './../action/user-actions'
import { SetRedirectUrlAction } from '../action/index'
import { SetSignupStateAction } from '../action/index'
import { User } from './../state/user'
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
    if (url === '/authorize' || url === '/signin') {
      return services.authService.getSession() == undefined ? '/signin' : '/home'
    }
    return url
  }

  @action()
  authorize(state: AppState, authorizeAction: AuthorizeAction): Observable<AppState> {
    this.onRedirect = authorizeAction.onRedirect
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ authInProgress: true })
      if (location.pathname === '/authorize') { return this.handleSSOAuth(observer) }
      // this.onRedirect(this.redirectUrl, services.authService.isAuthenticated(user && user.authInfo))
    })
  }

  @action()
  saveProfile(state: AppState, saveProfileAction: SaveProfileAction): Promise<AppState> {
    return services.authService.saveProfile(saveProfileAction.user, saveProfileAction.password)
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
  signIn(state: AppState, signInAction: SignInAction): Promise<AppState> {
    return services.authService.signIn(signInAction.userId, signInAction.password)
      .then(data => {
        console.log(data)
        return state
      })
  }

  @action()
  signOut(state: AppState, signOutAction: SignOutAction): AppState {
    services.authService.signOut()
    return state
  }

  private handleSSOAuth(observer) {
    services.authService.handleAuthentication()
      .then((user: User) => {
        observer.next({ authInProgress: false, draftUser: user, user: undefined })
        this.onRedirect('/profile')
      })
      .catch(error => {
        console.log(error)
        observer.next({ authInProgress: false })
        if (this.redirectUrl === '/signin') {
          this.onRedirect(this.redirectUrl, false)
        }
        return observer.next({ user: undefined })
      })
  }

}