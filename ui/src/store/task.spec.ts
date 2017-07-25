import { expect } from '../test/index'
import { task } from './task'

describe('task', () => {

  it('should perform an async task', (done) => {
    const result = []
    const subscription = task((observer, complete) => {
      setTimeout(() => complete(), 600)
    }).subscribe(response => result.push(response), undefined, () => {
      expect(result).be.a('array')
      expect(result).be.length(2)
      expect(result[0]).be.a('object')
      expect(result[0]).have.property('requestInProgress')
      expect(result[0].requestInProgress).be.equal(true)
      expect(result[1]).be.a('object')
      expect(result[1]).have.property('requestInProgress')
      expect(result[1].requestInProgress).be.equal(false)
      done()
      subscription.unsubscribe()
    })
  })

  it('should perform multiple async task', (done) => {
    const result = []

    task(() => undefined).subscribe()

    const subscription = task((observer, complete) => {
      setTimeout(() => complete(), 600)
    }).subscribe(response => result.push(response), undefined, () => {
      expect(result).be.a('array')
      expect(result).be.length(1)
      expect(result[0]).be.a('object')
      expect(result[0]).have.property('requestInProgress')
      expect(result[0].requestInProgress).be.equal(true)
      done()
      subscription.unsubscribe()
    })

  })

})