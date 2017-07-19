import * as auth0 from 'auth0-js'

import { AuthInfo } from './../state/auth-info'
import { User } from './../state/user'
import { api } from './api'
import { config } from '../app/config'

const ACCESS_INFO_KEY = 'access_info'
const AUTH_CONFIG = config.authConfig

class AuthService {

  private auth0 = new auth0.WebAuth(AUTH_CONFIG)

  public requestAuthCode(emailId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth0.passwordlessStart({
        connection: 'email',
        email: emailId,
        send: 'code'
      }, (err, res) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  public verifyAuthCode(emailId: string, authCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth0.passwordlessVerify({
        connection: 'email',
        email: emailId,
        verificationCode: authCode
      }, (err, res) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  public handleAuthentication(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash({ nonce: AUTH_CONFIG.nonce }, (err, authResult) => {
        if (err) return reject(err)
        if (authResult && authResult.accessToken && authResult.idToken) {
          return Promise.resolve(this.toUser(authResult))
            .then((user: User) => resolve(user))
            .catch(error => reject(error))
        }
      })
    })
  }

  public fetchUserInfo(userId: string, authToken: string) {
    return api.post('/user', { userId }, { authToken }).then(response => response.data)
  }

  public saveProfile(user: User, password: string) {
    console.log(user, password)
    return api.put('/profile', Object.assign({}, user, { password, authInfo: undefined }), {
      headers: {
        Authorization: `Bearer ${user.authInfo.accessToken}`
      }
    })
  }

  public signIn(username: string, password: string) {
    return api.post('/oauth2/token', {
      grant_type: 'password',
      username,
      password
    }, {
        headers: {
          Authorization: `Basic ${btoa(`${config.authService.clientId}:${config.authService.clientSecret}`)}`
        }
      }).then(response => response.data)
      .then(authInfo => this.prepareApi(authInfo.access_token) || authInfo)
    // .then(authInfo => this.toUser(authInfo, user))
    // .then((user: User) => this.setSession(user.authInfo) || user)
    // .then((user: User) => callback(undefined, user) || user)
    // .then(resolve, error => {
    //   reject(error)
    //   callback(error)
    // })
  }

  public signOut(): void {
    this.clearSession()
    this.auth0.logout({
      returnTo: AUTH_CONFIG.redirectUri
    })
  }

  public isAuthenticated(authInfo: AuthInfo): boolean {
    return authInfo && new Date().getTime() < authInfo.expiresAt
  }

  getSession(): AuthInfo {
    return JSON.parse(localStorage.getItem(ACCESS_INFO_KEY) || 'null')
  }

  private prepareApi(accessToken: string) {
    api.configure({
      authToken: accessToken
    })
  }

  private toUser(result: any): User {
    const { idTokenPayload } = result
    return {
      id: idTokenPayload.email,
      name: idTokenPayload.name || idTokenPayload.nickname,
      picture: idTokenPayload.picture,
      authInfo: {
        accessToken: result.idToken,
        expiresAt: result.expiresIn + new Date().getTime(),
        refreshToken: result.refreshToken
      }
    }
  }

  // private setSession(authInfo: AuthInfo): void {
  //   localStorage.setItem(ACCESS_INFO_KEY, JSON.stringify(authInfo))
  // }

  private clearSession(): void {
    localStorage.removeItem(ACCESS_INFO_KEY)
  }

}

export const authService = new AuthService()