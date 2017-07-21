import { FetchJogLogsAction, RemoveJogLogAction, SetFiltersAction } from '../action/index'
import { action, store } from 'statex/react'

import { AddJogLogAction } from './../action/jog-log-actions'
import { AppState } from './../state/app-state'
import { JogLog } from './../state/jog-log'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { services } from './../service/index'

@store()
export class JogLogStore {

  @action()
  fetchJogLogs(state: AppState, fetchJogLogsAction: FetchJogLogsAction): Observable<AppState> {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ requestInProgress: true })
      services.jogLogService.fetch(state.filters).then((jogLogs: JogLog[]) => {
        observer.next({ requestInProgress: false, jogLogs })
        observer.complete()
      }, () => {
        observer.next({ requestInProgress: false })
        observer.complete()
      })
    })
  }

  @action()
  addJogLog(state: AppState, addJogLogAction: AddJogLogAction): Observable<AppState> {

    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ requestInProgress: true })

      // this logic must be moved to server side
      let updatedJogLog = Object.assign({}, addJogLogAction.jogLog, {
        id: services.utilService.generateId(),
        averageSpeed: this.averageSpeed(addJogLogAction.jogLog.distance, addJogLogAction.jogLog.time)
      })

      services.jogLogService.add(updatedJogLog)
        .then((jogLog: JogLog) => {
          observer.next({
            requestInProgress: false,
            jogLogs: (state.jogLogs || []).concat(jogLog)
          })
          observer.complete()
        }, () => {
          observer.next({ requestInProgress: false })
          observer.complete()
        })
    })
  }

  @action()
  removeJogLog(state: AppState, removeJogLogAction: RemoveJogLogAction): Observable<AppState> {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ requestInProgress: true })
      services.jogLogService.remove(removeJogLogAction.id)
        .then(() => {
          observer.next({
            requestInProgress: false,
            jogLogs: (state.jogLogs || []).filter(item => item.id !== removeJogLogAction.id)
          })
          observer.complete()
        }, () => {
          observer.next({ requestInProgress: false })
          observer.complete()
        })
    })
  }

  @action()
  setFilters(state: AppState, setFiltersAction: SetFiltersAction): Observable<AppState> {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ requestInProgress: true, filters: setFiltersAction.filters })
      services.jogLogService.fetch(setFiltersAction.filters).then((jogLogs: JogLog[]) => {
        observer.next({ requestInProgress: false, jogLogs })
        observer.complete()
      }, () => {
        observer.next({ requestInProgress: false })
        observer.complete()
      })
    })
  }

  toMinutes(time: [number, number]): number {
    return [].concat(time || [0, 0])
      .reverse()
      .reduce((a, v, i) => a + v * i * 60)
  }

  averageSpeed(distance: number, time: [number, number]) {
    let minutes = this.toMinutes(time)
    return minutes === 0 ? 0 : parseFloat(parseFloat(`${distance / minutes * 60}`).toFixed(2))
  }

}