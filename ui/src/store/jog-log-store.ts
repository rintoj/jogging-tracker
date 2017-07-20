import { action, store } from 'statex/react'

import { AddJogLogAction } from './../action/jog-log-actions'
import { AppState } from './../state/app-state'
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

  toMinutes(time: [number, number]): number {
    return (time || [0, 0])
      .reverse()
      .reduce((a, v, i) => a + v * i * 60)
  }

  averageSpeed(distance: number, time: [number, number]) {
    let minutes = this.toMinutes(time)
    console.log(minutes, distance, minutes / distance, minutes / distance / 60)
    return minutes === 0 ? 0 : parseFloat(parseFloat(`${minutes / distance / 60}`).toFixed(2))
  }

}