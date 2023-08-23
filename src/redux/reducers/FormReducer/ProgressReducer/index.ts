import { Reducer } from 'redux'
import { SET_PROGRESS_OPTION, RESET_PROGRESS_OPTION } from 'src/redux/actions/form/progressAction'

export interface ProgressState {
  start: string
  end: string
}

const DEFAULT: ProgressState = {} as ProgressState

const _progress: Reducer<ProgressState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_PROGRESS_OPTION: {
      const { start, end } = action.payload
      return { ...state, start, end }
    }

    case RESET_PROGRESS_OPTION:
      return DEFAULT


    default:
      return state
  }
}

export default _progress
