import { Action } from 'statex'
import { JogLog } from './../state/jog-log'

export class AddJogLogAction extends Action {
  constructor(public jogLog: JogLog) { super() }
}