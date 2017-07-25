import { FetchStatisticsAction } from '../action/index'
import { StatisticsStore } from './statistics-store'
import { expect } from '../test/index'
import { services } from '../service/index'

describe('statistics-store', () => {

  const statisticsStore = new StatisticsStore()

  it('should handle FetchStatisticsAction', (done) => {
    services.statisticsService = {
      url: '/statistics',
      fetch: () => new Promise((resolve) => resolve(require('../test/statistics-test-data.json')))
    }
    const action = new FetchStatisticsAction()
    const result = []
    const subscription = statisticsStore.fetchStatistics({
      selectedUser: { id: 'user1' }
    }, action)
      .subscribe((response) => result.push(response), undefined, () => {
        expect(result).be.a('array')
        expect(result).be.length(2)
        expect(result[0]).be.a('object')
        expect(result[0]).have.property('statistics')
        expect(result[0].statistics).be.a('object')
        expect(result[0].statistics).have.property('overall')
        expect(result[0].statistics).have.property('yearly')
        expect(result[0].statistics).have.property('monthly')
        expect(result[0].statistics).have.property('weekly')
        expect(result[1]).be.a('object')
        expect(result[1]).have.property('requestInProgress')
        expect(result[1].requestInProgress).be.equal(false)
        done()
        subscription.unsubscribe()
      })
  })

  it('should return undefined if statistics object is empty', (done) => {
    services.statisticsService = {
      url: '/statistics',
      fetch: () => new Promise((resolve) => resolve({}))
    }
    const action = new FetchStatisticsAction()
    const result = []
    const subscription = statisticsStore.fetchStatistics({
      selectedUser: { id: 'user1' }
    }, action)
      .subscribe((response) => result.push(response), undefined, () => {
        expect(result).be.a('array')
        expect(result).be.length(2)
        expect(result[0]).be.a('object')
        expect(result[0]).have.property('statistics')
        expect(result[0].statistics).be.undefined
        expect(result[1]).have.property('requestInProgress')
        expect(result[1].requestInProgress).be.equal(false)
        done()
        subscription.unsubscribe()
      })
  })
})