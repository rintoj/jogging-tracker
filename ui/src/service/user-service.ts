import { AuthInfo } from './../state/auth-info'
import { User } from './../state/user'
import { api } from './api'
import { config } from '../app/config'

const ACCESS_INFO_KEY = 'access_info'

class UserService {

  fetch(): Promise<any> {
    return api.get('/oauth2/user', undefined)
      .then(response => response.data)
      .then(users => users.map((item): User => {
        return {
          id: item.userId,
          name: item.name,
          picture: item.picture,
          authInfo: { roles: item.roles }
        }
      }))
  }

  save(user: User, password: string, createOnly?: boolean) {
    const data = {
      userId: user.id,
      name: user.name,
      picture: user.picture,
      roles: user.authInfo.roles,
      password: password
    }

    return new Promise((resolve, reject) => {
      api.put(`/oauth2/user${createOnly ? '?createOnly=true' : ''}`, data)
        .then(response => {
          if (createOnly && response.status === 304) {
            return reject('User already exists')
          }
          resolve()
        })

    })
  }

  register(user: User, password: string) {

    const data = {
      userId: user.id,
      name: user.name,
      picture: user.picture,
      roles: user.authInfo.roles,
      password: password
    }

    return api.post('/oauth2/register', data, {
      headers: {
        Authorization: `Basic ${btoa(`${config.authService.clientId}:${config.authService.clientSecret}`)}`
      }
    }).then(response => response.data)
  }

  remove(id: string): Promise<any> {
    return api.delete(`/oauth2/user/${id}`)
      .then(response => response.data)
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
    return api.post('/oauth2/revoke', undefined)
      .then(() => this.clearSession())
      .then(() => this.prepareApi(undefined))
  }

  fetchProfile(authToken: string, userId?: string) {
    return api.get(`/profile${userId != undefined ? `/${userId}` : ''}`, undefined, { authToken })
      .then(response => response.data)
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
      id: user.id,
      name: user.name,
      picture: user.picture,
      authInfo: {
        accessToken: authInfo.access_token,
        expiresAt: (authInfo.expires_in * 1000) + new Date().getTime(),
        refreshToken: authInfo.refresh_token,
        roles: user.roles
      }
    }
  }
}

export const userService = new UserService()