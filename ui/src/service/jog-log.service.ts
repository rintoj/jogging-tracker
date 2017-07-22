import { Filters } from '../state/filters'
import { JogLog } from './../state/jog-log'
import { api } from './api'

export interface SaveResponse {
  created: boolean
  item: JogLog
}

export class JogLogService {

  readonly url = '/joglog'

  fetch(filters: Filters): Promise<JogLog[]> {
    let body
    if (filters != undefined && (filters.fromDate != undefined || filters.toDate != undefined)) {
      body = { date: {} }
      if (filters.fromDate != undefined) body.date.$gte = new Date(filters.fromDate)
      if (filters.toDate != undefined) body.date.$lte = new Date(filters.toDate)
    }

    return api.post(this.url, body)
      .then(response => response.data)
  }

  save(jogLog: JogLog): Promise<SaveResponse> {
    return api.put(this.url, jogLog)
      .then(response => response.data)
  }

  remove(id: string): Promise<any> {
    return api.delete(`${this.url}/${id}`)
      .then(response => response.data)
  }

}

export const jogLogService = new JogLogService()