import { FetchJogLogsAction, RemoveJogLogAction } from '../action/index'
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
      observer.next({ filters: fetchJogLogsAction.filters })
      services.jogLogService.fetch(fetchJogLogsAction.filters || state.filters)
        .then((jogLogs: JogLog[]) => {
          observer.next({ jogLogs })
          done()
        }, done)
    })
  }

  @action()
  addJogLog(state: AppState, addJogLogAction: AddJogLogAction): Observable<AppState> {
    return task((observer: Observer<AppState>, done) => {
      services.jogLogService.add(addJogLogAction.jogLog).then((jogLog: JogLog) => {
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

}