import { JogLog } from './../state/jog-log'
import { api } from './api'

export class JogLogService {

  readonly url = '/joglog'

  fetch(): Promise<JogLog[]> {
    return api.get(this.url)
      .then(response => response.data)
  }

  add(jogLog: JogLog): Promise<JogLog> {
    return api.put(this.url, jogLog)
      .then(response => response.data.item)
  }

  remove(id: string): Promise<any> {
    return api.delete(`${this.url}/${id}`)
      .then(response => response.data)
  }

}

export const jogLogService = new JogLogService()