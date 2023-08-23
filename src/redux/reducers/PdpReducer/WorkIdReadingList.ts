import { Reducer } from 'redux'

import { SET_BOOK_READING_LIST } from 'src/redux/actions/book/workIdReadingList'

export type WorkIdReadingListState = Record<string, string[]>

const DEFAULT: WorkIdReadingListState = {}

const workIdReadingList: Reducer<WorkIdReadingListState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_BOOK_READING_LIST: {
      const { workId, userIds } = action.payload
      return {
        ...state,
        [workId.toString()]: userIds,
      }
    }

    default:
      return state
  }
}

export default workIdReadingList
