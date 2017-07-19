import * as auth0 from 'auth0-js'

import { AuthInfo } from './../state/auth-info'
import { User } from './../state/user'
import { api } from './api'
import { config } from '../app/config'

const ACCESS_INFO_KEY = 'access_info'
const AUTH_CONFIG = config.authConfig

class AuthService {

  private auth0 = new auth0.WebAuth(AUTH_CONFIG)

  requestAuthCode(emailId: string): Promise<any> {
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

  verifyAuthCode(emailId: string, authCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth0.passwordlessVerify({
        connection: 'email',
        email: emailId,
        verificationCode: authCode
      }, (err, res) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  handleAuthentication(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash({ nonce: AUTH_CONFIG.nonce }, (err, authResult) => {
        if (err) return reject(err)
        if (authResult && authResult.accessToken && authResult.idToken) {
          return Promise.resolve(this.authResultToUser(authResult))
            .then((user: User) => resolve(user))
            .catch(error => reject(error))
        }
        reject(err)
      })
    })
  }

  fetchProfile(authToken: string) {
    return api.get('/profile', undefined, { authToken }).then(response => response.data)
  }

  saveProfile(user: User, password: string) {
    return api.put('/profile', Object.assign({}, user, { password, authInfo: undefined }), {
      headers: {
        Authorization: `Bearer ${user.authInfo.accessToken}`
      }
    })
  }

  signIn(username: string, password: string) {
    const params = new URLSearchParams()
    params.append('grant_type', 'password')
    params.append('username', username)
    params.append('password', password)

    return api.post('/oauth2/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${config.authService.clientId}:${config.authService.clientSecret}`)}`
      }
    }).then(response => response.data)
      .then(authInfo => this.fetchProfile(authInfo.access_token).then(user => ({ user, authInfo })))
      .then(data => this.toUser(data.user, data.authInfo))
      .then((user: User) => this.prepareApi(user.authInfo.accessToken) || user)
      .then((user: User) => this.setSession(user.authInfo) || user)
  }

  signOut(): Promise<any> {
    return api.post('/oauth2/revoke')
      .then(() => this.clearSession())
      .then(() => this.auth0.logout({
        returnTo: AUTH_CONFIG.redirectUri
      }))
  }

  isAuthenticated(authInfo: AuthInfo): boolean {
    return authInfo && new Date().getTime() < authInfo.expiresAt
  }

  getSession(): AuthInfo {
    return JSON.parse(localStorage.getItem(ACCESS_INFO_KEY) || 'null')
  }

  setSession(authInfo: AuthInfo): void {
    localStorage.setItem(ACCESS_INFO_KEY, JSON.stringify(authInfo))
  }

  clearSession(): void {
    localStorage.removeItem(ACCESS_INFO_KEY)
  }

  prepareApi(accessToken: string) {
    api.configure({
      authToken: accessToken
    })
  }

  private toUser(user, authInfo): User {
    return {
      id: user.userId,
      name: user.name,
      picture: user.picture,
      authInfo: {
        accessToken: authInfo.access_token,
        expiresAt: authInfo.expires_in + new Date().getTime(),
        refreshToken: authInfo.refresh_token,
        roles: user.roles
      }
    }
  }

  private authResultToUser(result: any): User {
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

}

export const authService = new AuthService()