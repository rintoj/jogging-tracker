import { HideFormAction, ShowFormAction } from '../action/ui-actions'
import { action, store } from 'statex/react'

import { AppState } from './../state/app-state'

@store()
export class UiStore {

  @action()
  showFormAction(state: AppState, showFormActionAction: ShowFormAction): AppState {
    return { showForm: true, selectedJogLog: showFormActionAction.jogLog }
  }

  @action()
  hideFormAction(state: AppState, hideFormActionAction: HideFormAction): AppState {
    return { showForm: false, selectedJogLog: undefined }
  }

}