import { FetchJogLogsAction, RemoveJogLogAction } from '../action/index'
import { action, store } from 'statex/react'

import { AppState } from './../state/app-state'
import { JogLog } from './../state/jog-log'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { SaveJogLogAction } from './../action/jog-log-actions'
import { services } from './../service/index'
import { task } from './task'

@store()
export class JogLogStore {

  @action()
  fetchJogLogs(state: AppState, fetchJogLogsAction: FetchJogLogsAction): Observable<AppState> {
    return task((observer: Observer<AppState>, done) => {
      observer.next({ filters: fetchJogLogsAction.filters })
      services.jogLogService.fetch(fetchJogLogsAction.filters || state.filters,
        state.selectedUser && state.selectedUser.id)
        .then((jogLogs: JogLog[]) => {
          observer.next({ jogLogs })
          done()
        }, done)
    })
  }

  @action()
  saveJogLog(state: AppState, saveJogLogAction: SaveJogLogAction): Observable<AppState> {
    return task((observer: Observer<AppState>, done) => {
      Promise.resolve()
        .then(() => services.jogLogService.save(saveJogLogAction.jogLog,
          state.selectedUser && state.selectedUser.id))
        .then(() => services.jogLogService.fetch(state.filters,
          state.selectedUser && state.selectedUser.id))
        .then((jogLogs) => {
          observer.next({ jogLogs })
          done()
        }, done)
    })
  }

  @action()
  removeJogLog(state: AppState, removeJogLogAction: RemoveJogLogAction): Observable<AppState> {
    return task((observer: Observer<AppState>, done) => {
      services.jogLogService.remove(removeJogLogAction.id,
        state.selectedUser && state.selectedUser.id).then(() => {
          observer.next({
            jogLogs: (state.jogLogs || []).filter(item => item.id !== removeJogLogAction.id)
          })
          done()
        }, done)
    })
  }

}