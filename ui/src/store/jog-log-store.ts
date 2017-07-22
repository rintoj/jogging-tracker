import { FetchJogLogsAction, RemoveJogLogAction, SetFiltersAction } from '../action/index'
import { action, store } from 'statex/react'

import { AddJogLogAction } from './../action/jog-log-actions'
import { AppState } from './../state/app-state'
import { JogLog } from './../state/jog-log'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { services } from './../service/index'
import { task } from './task'

@store()
export class JogLogStore {

  @action()
  fetchJogLogs(state: AppState, fetchJogLogsAction: FetchJogLogsAction): Observable<AppState> {
    return task((observer: Observer<AppState>, done) => {
      services.jogLogService.fetch(state.filters).then((jogLogs: JogLog[]) => {
        observer.next({ jogLogs })
        done()
      }, done)
    })
  }

  @action()
  addJogLog(state: AppState, addJogLogAction: AddJogLogAction): Observable<AppState> {
    return task((observer: Observer<AppState>, done) => {
      // TODO: this logic must be moved to server side
      let updatedJogLog = Object.assign({}, addJogLogAction.jogLog, {
        id: services.utilService.generateId(),
        averageSpeed: this.averageSpeed(addJogLogAction.jogLog.distance, addJogLogAction.jogLog.time)
      })

      services.jogLogService.add(updatedJogLog).then((jogLog: JogLog) => {
        observer.next({
          jogLogs: (state.jogLogs || []).concat(jogLog)
        })
        done()
      }, done)
    })
  }

  @action()
  removeJogLog(state: AppState, removeJogLogAction: RemoveJogLogAction): Observable<AppState> {
    return task((observer: Observer<AppState>, done) => {
      services.jogLogService.remove(removeJogLogAction.id).then(() => {
        observer.next({
          jogLogs: (state.jogLogs || []).filter(item => item.id !== removeJogLogAction.id)
        })
        done()
      }, done)
    })
  }

  @action()
  setFilters(state: AppState, setFiltersAction: SetFiltersAction): Observable<AppState> {
    return task((observer: Observer<AppState>, done) => {
      observer.next({ filters: setFiltersAction.filters })
      services.jogLogService.fetch(setFiltersAction.filters).then((jogLogs: JogLog[]) => {
        observer.next({ jogLogs })
        done()
      }, done)
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