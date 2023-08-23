import { Reducer } from 'redux'
import { CommunitiesInterestsModel } from 'src/models/Communities/InterestModel'
import { SET_COMMUNITIES_ACTION } from 'src/redux/actions/communities/fetchInterestsAction'
import {
  SET_SEARCH_RESULTS, SET_SEARCH_MORE_RESULTS,
} from 'src/redux/actions/legacySearch/searchResultsAction'

export type InterestsState = Record<number, CommunitiesInterestsModel>

const DEFAULT: InterestsState = {}

const interests: Reducer<InterestsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_COMMUNITIES_ACTION:
      return ({
        ...state,
        ...action.payload,
      })

    case SET_SEARCH_RESULTS:
    case SET_SEARCH_MORE_RESULTS: {
      const { categories } = action.payload
      if (categories) {
        return ({
          ...state,
          ...categories,
        })
      }
      return state
    }

    default:
      return state
  }
}

export default interests
