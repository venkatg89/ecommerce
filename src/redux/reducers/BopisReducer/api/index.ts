import { combineReducers } from 'redux'

import { makeApiStatusReducerUsingApiAction } from 'src/helpers/redux/makeApiStateReducer'
import { ApiStatus } from 'src/models/ApiStatus'

import {
  storeSearchStoresActions,
  storeSearchSuggestionsApiStatusActions,
} from 'src/redux/actions/store/search'
import { storeSearchSuggestionsCafeApiStatusActions } from 'src/redux/actions/cafe/venuesAction'

export interface ApiState {
  searchStores: ApiStatus
  searchStoreSuggestions: ApiStatus
  searchCafeSuggestions: ApiStatus
}

export default combineReducers({
  searchStores: makeApiStatusReducerUsingApiAction(
    storeSearchStoresActions.types,
  ),
  searchStoreSuggestions: makeApiStatusReducerUsingApiAction(
    storeSearchSuggestionsApiStatusActions.types,
  ),
  searchCafeSuggestions: makeApiStatusReducerUsingApiAction(
    storeSearchSuggestionsCafeApiStatusActions.types,
  ),
})
