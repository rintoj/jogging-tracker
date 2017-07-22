import { SaveProfileAction, SignOutAction } from '../action/index'
import { SignInAction, VerifyAuthCodeAction } from '../action/index'
import { action, store } from 'statex/react'

import { AppState } from './../state/app-state'
import { AuthInfo } from './../state/auth-info'
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
      return services.authService.getSession() == undefined ? '/signin' : '/'
    }
    return url
  }

  @action()
  authorize(state: AppState, authorizeAction: AuthorizeAction): Observable<AppState> {
    this.onRedirect = authorizeAction.onRedirect
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ authInProgress: true })
      if (location.pathname === '/authorize') {
        return this.handleSSOAuth(observer)
      }
      this.validateSession(observer)
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
      .then(() => state)
  }

  @action()
  signIn(state: AppState, signInAction: SignInAction): Observable<AppState> {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ draftUser: undefined, authInProgress: true })
      services.authService.signIn(signInAction.userId, signInAction.password)
        .then(user => {
          observer.next({ user, authInProgress: false })
          observer.complete()
          this.onRedirect(this.redirectUrl === '/signin' ? '/home' : this.redirectUrl, true)
        }, error => {
          observer.next({ authInProgress: false })
          observer.error(error)
          observer.complete()
        })
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
        observer.next({ authInProgress: false, user: undefined })
        if (this.redirectUrl === '/signin') {
          this.onRedirect(this.redirectUrl, false)
        }
      })
  }

  private validateSession(observer) {
    const session: AuthInfo = services.authService.getSession()
    if (session == undefined || !services.authService.isAuthenticated(session)) {
      observer.next({ authInProgress: false, user: undefined })
      observer.complete()
      return this.onRedirect('/signin', false)
    }

    services.authService.fetchProfile(session.accessToken)
      .then((user) => {
        user.authInfo = session
        services.authService.prepareApi(session.accessToken)
        observer.next({ user })
        if (user.authInfo.roles.indexOf('admin') >= 0) {
          services.authService.fetchUsers().then(users => {
            console.log(users)
            observer.next({ users })
            this.onRedirect(this.redirectUrl === '/signin' ? '/home' : this.redirectUrl, true)
          })
        } else {
          this.onRedirect(this.redirectUrl === '/signin' ? '/home' : this.redirectUrl, true)
        }
      })
      .catch(error => {
        console.log(error)
        services.authService.clearSession()
        observer.next({ authInProgress: false, user: undefined })
        this.onRedirect(this.redirectUrl === '/signin' ? '/home' : this.redirectUrl, true)
        if (this.redirectUrl === '/signin') {
          this.onRedirect(this.redirectUrl, false)
        }
      })
  }

}