import { ApiOptions } from './api'
import axios from 'axios'
import { config } from './../app/config'

export interface ApiOptions {
  baseURL?: string
  headers?: Object
  timeout?: number
  authToken?: string
}

export interface Request {
  url?: string
  method?: 'get' | 'post' | 'put' | 'delete' | 'options' | 'header'
  headers?: Object
  params?: Object
  data?: Object
  timeout?: number
  authToken?: string
}

export class Api {

  private options: ApiOptions = {
    baseURL: config.apiUrl
  }

  get(url: string, params?: Object, options?: Request) {
    return this.request(Object.assign({}, options, {
      url,
      params,
      method: 'get'
    }))
  }

  post(url: string, data: Object, options?: Request) {
    return this.request(Object.assign({}, options, {
      url,
      data,
      method: 'post'
    }))
  }

  put(url: string, data: Object, options?: Request) {
    return this.request(Object.assign({}, options, {
      url,
      data,
      method: 'put'
    }))
  }

  delete(url: string, data?: Object, options?: Request) {
    return this.request(Object.assign({}, options, {
      url,
      data,
      method: 'delete'
    }))
  }

  request(request: Request): Promise<any> {
    const header: any = {}
    if (this.options.authToken != undefined || request.authToken != undefined) {
      header.Authorization = `Bearer ${this.options.authToken || request.authToken}`
    }
    return axios(Object.assign({}, this.options, request, {
      headers: Object.assign(header, this.options.headers, request.headers)
    }))
  }

  configure(options: ApiOptions, replace?: boolean) {
    this.options = replace ? (options || {}) : Object.assign({}, this.options, options)
  }

}

export const api = new Api()