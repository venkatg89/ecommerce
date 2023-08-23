import { Reducer } from 'redux'

import { SET_SAVE_FOR_LATER } from 'src/redux/actions/saveForLaterList/saveForLaterAction'
import { SaveForLaterListModel } from 'src/models/SaveForLaterListModel'

export type SaveForLaterListState = SaveForLaterListModel

const DEFAULT: SaveForLaterListState = {}

const saveForLaterList: Reducer<SaveForLaterListState> = (
  state = DEFAULT,
  action,
) => {
  switch (action.type) {
    case SET_SAVE_FOR_LATER: {
      return action.payload
    }

    default:
      return state
  }
}

export default saveForLaterList
