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

  public handleAuthentication(callback: Function): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash({ nonce: AUTH_CONFIG.nonce }, (err, authResult) => {
        // return error
        if (err) {
          return callback(err)
        }

        let authInfo

        // authenticate user
        if (authResult && authResult.accessToken && authResult.idToken) {
          authInfo = this.toAuthInfo(authResult)
        } else {
          authInfo = this.getSession()
        }

        if (authInfo == undefined) {
          return callback('Not authenticated')
        }

        // fetch user info
        this.fetchUserInfo(authInfo.email, authInfo.accessToken)
          .then(user => this.prepareApi(authInfo.accessToken) || user)
          .then(user => this.toUser(authInfo, user))
          .then((user: User) => this.setSession(user.authInfo) || user)
          .then((user: User) => callback(undefined, user) || user)
          .then(resolve, error => {
            reject(error)
            callback(error)
          })
      })
    })
  }

  public fetchUserInfo(userId: string, authToken: string) {
    return api.post('/user', { userId }, { authToken }).then(response => response.data)
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

  private toAuthInfo(authResult): AuthInfo {
    return authResult ? {
      accessToken: authResult.idToken,
      expiresAt: (authResult.expiresIn * 1000) + new Date().getTime(),
      refreshToken: authResult.refreshToken
    } : undefined
  }

  private toUser(authInfo: AuthInfo, user): User {
    return user ? {
      id: user.userId,
      email: user.email_verified ? user.email : undefined,
      name: user.name,
      picture: user.picture,
      authInfo: Object.assign({
        roles: user.roles
      }, authInfo)
    } : undefined
  }

  private setSession(authInfo: AuthInfo): void {
    localStorage.setItem(ACCESS_INFO_KEY, JSON.stringify(authInfo))
  }

  private clearSession(): void {
    localStorage.removeItem(ACCESS_INFO_KEY)
  }

}

export const authService = new AuthService()