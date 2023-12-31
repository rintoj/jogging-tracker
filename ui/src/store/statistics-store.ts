import { action, store } from 'statex/react'

import { AppState } from '../state/index'
import { FetchStatisticsAction } from '../action/statistics-actions'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { services } from '../service/index'
import { task } from './task'

@store()
export class StatisticsStore {

  @action()
  fetchStatistics(state: AppState, fetchStatisticsAction: FetchStatisticsAction): Observable<AppState> {
    return task((observer: Observer<AppState>, done) => {
      services.statisticsService.fetch(state.selectedUser && state.selectedUser.id).then(statistics => {
        observer.next({ statistics: Object.keys(statistics).length === 0 ? undefined : statistics })
        done()
      }, done)
    })
  }
}