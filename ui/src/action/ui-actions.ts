import { Action } from 'statex'
import { JogLog } from '../state/jog-log'

export class ShowFormAction extends Action {
  constructor(public jogLog?: JogLog) { super() }
}
export class HideFormAction extends Action { }