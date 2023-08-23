import { combineReducers } from 'redux'

import errors, { ErrorsState } from './ErrorsReducer'
import progress, { ProgressState } from './ProgressReducer'

export interface FormState {
  errors: ErrorsState;
  progress: ProgressState
}

export default combineReducers<FormState>({
  errors,
  progress,
})
