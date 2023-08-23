import { Reducer } from 'redux'

import { Listing } from 'src/models/ListingModel'
import {
  // QUESTION_PER_PAGE,
  SET_HOME_FEED_ACTION,
  SET_MORE_HOME_FEED_ACTION,
} from 'src/redux/actions/communities/fetchFeedhomeQuestionsAction'

export type HomeQuestionsListState = Listing


const DEFAULT: Listing = {
  ids: [],
  skip: 0,
  canLoadMore: false,
}


const homeQuestions: Reducer<HomeQuestionsListState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_HOME_FEED_ACTION: {
      const { ids } = action.payload
      return {
        ids,
        skip: ids.length,
        canLoadMore: ids.length >= 0, // TODO: should change ids.length >= QUESTION_PER_PAGE after Prod API updated
      }
    }
    case SET_MORE_HOME_FEED_ACTION: {
      const { ids } = action.payload
      return {
        ids: [...(new Set([...state.ids, ...ids]))],
        skip: (state.skip + ids.length),
        canLoadMore: ids.length >= 0, // TODO: should change ids.length >= QUESTION_PER_PAGE after Prod API updated
      }
    }

    default:
      return state
  }
}

export default homeQuestions
