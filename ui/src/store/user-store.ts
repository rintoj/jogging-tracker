import { action, store } from 'statex/react'

import { AppState } from './../state/app-state'
import { AuthorizeAction } from './../action/user-actions'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { SendAuthCodeAction } from './../action/user-actions'
import { SetSignupStateAction } from '../action/index'
import { User } from './../state/user'
import { services } from './../service/index'

@store()
export class UserStore {

  @action()
  authorize(state: AppState, authorizeAction: AuthorizeAction): Observable<AppState> {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ authInProgress: true })
      services.authService.handleAuthentication((error, user: User) => {
        observer.next({ authInProgress: false })
        if (error) { return observer.next({ user: undefined }) }
        observer.next({ user })
        // if (user != null && state.user == null) {
        //   this.router.navigate([this.redirectUrl])
        //   this.removeRedirectUrl()
        // }
      })
    })
  }

  @action()
  sendAuthCode(state: AppState, sendAuthCodeAction: SendAuthCodeAction): Promise<AppState> {
    return services.authService.requestAuthCode(sendAuthCodeAction.email)
      .then(() => state, error => error)
  }

  @action()
  setSignupPageState(state: AppState, setSignupPageStateAction: SetSignupStateAction): AppState {
    return { signupPageState: setSignupPageStateAction.state }
  }

}