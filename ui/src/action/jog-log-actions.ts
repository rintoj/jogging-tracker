import { Action } from 'statex'
import { Filters } from '../state/filters'
import { JogLog } from './../state/jog-log'

export class AddJogLogAction extends Action {
  constructor(public jogLog: JogLog) { super() }
}
export class RemoveJogLogAction extends Action {
  constructor(public id: string) { super() }
}
export class FetchJogLogsAction extends Action { }
export class SetFiltersAction extends Action {
  constructor(public filters: Filters) { super() }
}