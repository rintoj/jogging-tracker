import * as chaiObj from 'chai'

chaiObj.should()
chaiObj.use(require('chai-spies'))

export const chai = chaiObj
export const expect = chaiObj.expect