import { api } from './api'

export class StatisticsService {

  readonly url = '/statistics'

  fetch(user: string) {
    return api.get(`${this.url}?user=${user}`)
      .then(response => response.data)
  }
}

export const statisticsService = new StatisticsService()