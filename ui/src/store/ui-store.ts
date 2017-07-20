import { HideFormAction, ShowFormAction, ToggleFormAction } from '../action/ui-actions'
import { action, store } from 'statex/react'

import { AppState } from './../state/app-state'

@store()
export class UiStore {

  @action()
  showFormAction(state: AppState, showFormActionAction: ShowFormAction): AppState {
    return { showForm: true }
  }

  @action()
  hideFormAction(state: AppState, hideFormActionAction: HideFormAction): AppState {
    return { showForm: false }
  }

  @action()
  toggleFormAction(state: AppState, toggleFormActionAction: ToggleFormAction): AppState {
    return { showForm: !state.showForm }
  }
}