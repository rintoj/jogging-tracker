import { api } from './api'

export class StatisticsService {

  readonly url = '/statistics'

  fetch() {
    return api.get(this.url)
      .then(response => response.data)
  }
}

export const statisticsService = new StatisticsService()