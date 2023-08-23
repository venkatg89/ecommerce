import { Reducer } from 'redux'
import {
  SET_CATEGORY_QUESTION_IDS_ACTION,
  SET_MORE_CATEGORY_QUESTION_IDS_ACTION,
  QUESTION_PER_PAGE,
} from 'src/redux/actions/communities/fetchCategoryQuestionsAction'
import { Listing } from 'src/models/ListingModel'

export type CategoryQuestionIdsState = Record<string, Listing>

const DEFAULT = {} as CategoryQuestionIdsState

const categoryQuestionIds: Reducer<CategoryQuestionIdsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CATEGORY_QUESTION_IDS_ACTION: {
      const { filter, ids } = action.payload
      return {
        ...state,
        [filter]: {
          ids,
          skip: ids.length,
          canLoadMore: ids.length >= QUESTION_PER_PAGE,
        },
      }
    }

    case SET_MORE_CATEGORY_QUESTION_IDS_ACTION: {
      const { filter, ids } = action.payload
      return {
        ...state,
        [filter]: {
          ids: [...(new Set([...state[filter].ids, ...ids]))],
          skip: state[filter].skip + ids.length,
          canLoadMore: ids.length >= QUESTION_PER_PAGE,
        },
      }
    }

    default:
      return state
  }
}

export default categoryQuestionIds
