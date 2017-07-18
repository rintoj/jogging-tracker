import * as auth0 from 'auth0-js'

import { AuthInfo } from './../state/auth-info'
import { User } from './../state/user'
import { config } from '../app/config'

// import { api } from './api'

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
          window.location.hash = ''
          authInfo = this.toAuthInfo(authResult)
        } else {
          authInfo = this.getSession()
        }

        if (authInfo == undefined) {
          return callback('Not authenticated')
        }

        // fetch user info
        this.fetchUserInfo(authInfo.accessToken)
          // .then(user => this.prepareRestfulService(authInfo) || user)
          // .then(user => this.fetchCustomer(user))
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

  public fetchUserInfo(accessToken: string) {
    return new Promise((resolve, reject) => {
      this.auth0.client.userInfo(accessToken, (err, user) => {
        if (err) { return reject(err) }
        resolve(user)
      })
    })
  }

  // public fetchCustomer(user: User): Promise<User> {
  //   return this.api.get(this.url).then(
  //     customers => Object.assign({ authorized: true }, user, customers[0]),
  //     error => Object.assign({ authorized: false }, user)
  //   )
  // }

  // public updateCustomer(user: User): Promise<User> {
  //   const userInfo = {
  //     customerID: user.id,
  //     nmi: user.nmi,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     email: user.email,
  //     mobile: user.mobile,
  //     addressLine1: user.address1,
  //     addressLine2: user.address2,
  //     postCode: user.postCode,
  //     state: user.state,
  //     role: 'user'
  //   }
  //   // return this.restService.put(this.urlCustomerSubmit, userInfo)
  // }

  public signOut(): void {
    this.clearSession()
    this.auth0.logout({
      returnTo: AUTH_CONFIG.redirectUri
    })
  }

  public isAuthenticated(user: User): boolean {
    // const authInfo: AuthInfo = this.getSession()
    const authInfo: AuthInfo = user && user.authInfo
    return authInfo && new Date().getTime() < authInfo.expiresAt
  }

  // private prepareRestfulService(authInfo: AuthInfo) {
  //   this.restService.setHeaders({
  //     'Authorization': authInfo != null ? `${authInfo.tokenType} ${authInfo.idToken}` : undefined
  //   })
  // }

  private toAuthInfo(authResult) {
    return authResult ? {
      accessToken: authResult.accessToken,
      expiresAt: (authResult.expiresIn * 1000) + new Date().getTime(),
      idToken: authResult.idToken,
      refreshToken: authResult.refreshToken,
      tokenType: authResult.tokenType
    } : undefined
  }

  private toUser(authInfo: AuthInfo, user): User {
    return user ? {
      id: user.customerID,
      email: user.email_verified ? user.email : undefined,
      name: (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.nickname || user.name,
      picture: user.picture,
      nmi: user.nmi,
      address1: user.addressLine1,
      address2: user.addressLine2,
      state: user.state,
      postCode: user.postCode,
      mobile: user.mobile,
      authInfo: Object.assign({
        role: user.role
      }, authInfo)
    } : undefined
  }

  private getSession(): AuthInfo {
    return JSON.parse(localStorage.getItem(ACCESS_INFO_KEY) || 'null')
  }

  private setSession(authInfo: AuthInfo): void {
    localStorage.setItem(ACCESS_INFO_KEY, JSON.stringify(authInfo))
  }

  private clearSession(): void {
    localStorage.removeItem(ACCESS_INFO_KEY)
  }

}

export const authService = new AuthService()