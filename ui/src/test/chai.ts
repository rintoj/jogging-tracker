import * as chaiObj from 'chai'

chaiObj.should()
chaiObj.use(require('chai-spies'))

chaiObj.simulateBrowser = () => {

  let browser: any = global

  // define btoa
  browser.btoa = value => value

  // define URLSearchParams
  class URLSearchParams {
    data = {}
    append(name, value) {
      this.data[name] = value
    }
  }
  browser.URLSearchParams = URLSearchParams

  // define localStorage
  browser.localStorage = {
    getItem: (name) => this[name],
    setItem: (name, value) => this[name] = value,
    removeItem: (name) => delete this[name]
  }
}

export const chai = chaiObj
export const expect = chaiObj.expect