import { action, store } from 'statex/react'

import { AddJogLogAction } from './../action/jog-log-actions'
import { AppState } from './../state/app-state'
import { RemoveJogLogAction } from '../action/index'
import { services } from './../service/index'

@store()
export class JogLogStore {

  @action()
  addJogLog(state: AppState, addJogLogAction: AddJogLogAction): AppState {
    return {
      jogLogs: (state.jogLogs || []).concat(Object.assign({}, addJogLogAction.jogLog, {
        id: services.utilService.generateId(),
        averageSpeed: this.averageSpeed(addJogLogAction.jogLog.distance, addJogLogAction.jogLog.time)
      }))
    }
  }

  @action()
  removeJogLog(state: AppState, removeJogLogAction: RemoveJogLogAction): AppState {
    return {
      jogLogs: (state.jogLogs || []).filter(item => item.id !== removeJogLogAction.id)
    }
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