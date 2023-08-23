import { combineReducers } from 'redux'

import details, { DetailsState } from './DetailsReducer'

export interface HomeState {
  details: DetailsState
}

export default combineReducers<HomeState>({
  details,
})
