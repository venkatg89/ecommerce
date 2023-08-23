import { SearchTypesKeys } from 'src/constants/search'
import { State } from 'src/redux/reducers'

const DEFAULT_SEARCH_LISTING_TYPE = { skip: 0, canLoadMore: true }

export const searchListingByTypeSelector = (stateAny, props) => {
  const state = stateAny as State
  const { searchType } = props
  return state.listings.search[searchType] || DEFAULT_SEARCH_LISTING_TYPE
}

export const hasBookResultsSelector = (stateAny) => {
  const state = stateAny as State
  const bookResults = state.listings.search[SearchTypesKeys.BOOKS] || {}
  const results = bookResults.ids || []
  return !!results.length
}

export const searchListingsSelector = (stateAny) => {
  const state = stateAny as State
  return state.listings.search
}
