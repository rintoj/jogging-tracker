import { FetchUsersAction, SignOutAction } from '../action/index'
import { RegisterUserAction, SelectUserAction } from '../action/index'
import { RemoveUserAction, SignInAction } from '../action/index'
import { SaveUserAction, SetRedirectUrlAction } from '../action/index'
import { action, store } from 'statex/react'

import { AppState } from './../state/app-state'
import { AuthInfo } from './../state/auth-info'
import { AuthorizeAction } from './../action/user-actions'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { User } from './../state/user'
import { services } from './../service/index'

const REDIRECT_URL_KEY = 'redirect_url'

@store()
export class UserStore {

  _redirectUrl: string
  onRedirect: Function

  get redirectUrl() {
    return this.validateUrl(this._redirectUrl ||
      (this._redirectUrl = localStorage.getItem(REDIRECT_URL_KEY) || '/home'))
  }

  set redirectUrl(url: string) {
    this._redirectUrl = url
    if (url != undefined) {
      localStorage.setItem(REDIRECT_URL_KEY, this._redirectUrl)
    }
  }

  validateUrl(url: string): string {
    if (url === '/authorize' || url === '/signin') {
      return services.userService.getSession() == undefined ? '/signin' : '/'
    }
    return url
  }

  @action()
  authorize(state: AppState, authorizeAction: AuthorizeAction): Observable<AppState> {
    this.onRedirect = authorizeAction.onRedirect
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ authInProgress: true })
      this.validateSession(observer)
    })
  }

  @action()
  setRedirectUrl(state: AppState, setRedirectUrlAction: SetRedirectUrlAction): AppState {
    this.redirectUrl = setRedirectUrlAction.redirectUrl
    return state
  }

  @action()
  fetchUsers(state: AppState, fetchUsersAction: FetchUsersAction): Observable<AppState> {
    return Observable.create((observer: Observer<AppState>) => {
      this.fetchUserList(state.user, observer, false)
        .then(() => observer.complete(), () => observer.complete())
    })
  }

  @action()
  saveUser(state: AppState, saveUserAction: SaveUserAction): Promise<AppState> {
    return services.userService.save(saveUserAction.user, saveUserAction.password, saveUserAction.createOnly)
      .then(() => state)
  }

  @action()
  registerUser(state: AppState, registerUserAction: RegisterUserAction): Promise<AppState> {
    return services.userService.register(registerUserAction.user, registerUserAction.password)
      .then(() => state)
  }

  @action()
  removeProfile(state: AppState, removeProfileAction: RemoveUserAction): Promise<AppState> {
    return services.userService.remove(removeProfileAction.id).then(() => ({
      users: (state.users || []).filter(user => user.id !== removeProfileAction.id)
    }))
  }

  @action()
  signIn(state: AppState, signInAction: SignInAction): Observable<AppState> {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ draftUser: undefined, authInProgress: true })
      services.userService.signIn(signInAction.userId, signInAction.password)
        .then(user => {
          observer.next({ user, authInProgress: false })
          if ((user.authInfo.roles.indexOf('admin') >= 0) ||
            (user.authInfo.roles.indexOf('manager') >= 0)) {
            return this.fetchUserList(user, observer, true).then(() => observer.complete())
          }
          observer.complete()
          return this.redirect()
        }, error => {
          observer.next({ authInProgress: false })
          observer.error(error)
          observer.complete()
        })
    })
  }

  @action()
  signOut(state: AppState, signOutAction: SignOutAction): Promise<AppState> {
    const resetState: AppState = {
      user: undefined,
      selectedUser: undefined,
      authInProgress: false
    }

    return new Promise((resolve, reject) => {
      services.userService.signOut()
        .then(() => resolve(resetState))
        .catch(() => resolve(resetState))
    })
  }

  @action()
  selectUser(state: AppState, selectUserAction: SelectUserAction): AppState {
    return { selectedUser: selectUserAction.user }
  }

  redirect(error?: boolean) {
    if (typeof this.onRedirect === 'function') {
      if (error) {
        return this.onRedirect(this.redirectUrl === '/signin' ? this.redirectUrl : '/')
      }
      this.onRedirect(this.redirectUrl === '/signin' ? '/' : this.redirectUrl)
    }
  }

  private fetchUserList(user: User, observer: Observer<AppState>, reroute: boolean): Promise<any> {
    return services.userService.fetch().then(users => {
      const selectedUser = users.find(item => item.id === user.id)
      observer.next({ users, selectedUser })
      if (reroute) this.redirect()
    })
  }

  private validateSession(observer) {
    const session: AuthInfo = services.userService.getSession()
    if (session == undefined || !services.userService.isAuthenticated(session)) {
      observer.next({ authInProgress: false, user: undefined })
      return observer.complete()
    }

    services.userService.fetchProfile(session.accessToken)
      .then((user) => {
        user.authInfo = session
        services.userService.prepareApi(session.accessToken)
        observer.next({ user })
        if ((user.authInfo.roles.indexOf('admin') >= 0) ||
          (user.authInfo.roles.indexOf('manager') >= 0)) {
          return this.fetchUserList(user, observer, true).then(() => observer.complete())
        }
        observer.complete()
        return this.redirect()
      })
      .catch(error => {
        services.userService.clearSession()
        observer.next({ authInProgress: false, user: undefined })
        this.redirect(true)
        observer.complete()
      })
  }

}