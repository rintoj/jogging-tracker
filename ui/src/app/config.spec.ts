import { expect } from '../test/index'
import { getConfig } from './config'

describe('config', () => {
  it('should return dev config', () => {
    const result = getConfig(true)
    expect(result.production).to.equal(false)
  })
  it('should return prod config', () => {
    const result = getConfig(false)
    expect(result.production).to.equal(true)
  })
})