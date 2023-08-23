import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import {
  makeRequestKeyFromActions,
  cancelApiRequestFromActions,
} from 'src/helpers/redux/cancelTokenSources'

import { SearchTypesKeys } from 'src/constants/search'
import {
  getMilqSearchResults,
  normalizeMilqSearchResultsResponseData,
} from 'src/endpoints/milq/search/results'
import {
  getBookModel as getMilqBookSearchResults,
  normalizeMilqBookSearchResultsResponseData,
} from 'src/endpoints/milq/book'
import { fetchQuestionsByIdsAction } from 'src/redux/actions/communities/fetchQuestionsByIdAction'
import { setAnswersAction } from 'src/redux/actions/book/fetchAnswersForQuestionAction'

import { RequestStatus } from 'src/models/ApiStatus'
import { searchListingByTypeSelector } from 'src/redux/selectors/listings/searchSelector'
import { searchResultsApiStatusSelector } from 'src/redux/selectors/searchSelector'
import { State } from 'src/redux/reducers'

export const SET_SEARCH_RESULTS = 'SEARCH__RESULTS_SET'
const setSearchResults = makeActionCreator(SET_SEARCH_RESULTS)

export const SET_SEARCH_MORE_RESULTS = 'SEARCH__MORE_RESULTS_SET'
const setSearchMoreResults = makeActionCreator(SET_SEARCH_MORE_RESULTS)

export const CLEAR_SEARCH_RESULTS = 'SEARCH__RESULTS_CLEAR'
export const clearSearchResultsAction = makeActionCreator(CLEAR_SEARCH_RESULTS)

export const searchResultsApiStatusActions = makeApiActionsWithIdPayloadMaker(
  'searchResults',
  'SEARCH__RESULTS',
)

export interface FetchSearchResultsActionParams {
  query: string
  searchType: SearchTypesKeys
}

export const fetchSearchResultsAction: (
  params: FetchSearchResultsActionParams,
) => ThunkedAction<State, boolean> = ({ query, searchType }) => async (
  dispatch,
  getState,
) => {
  if (
    searchResultsApiStatusSelector(getState(), { searchType }) ===
    RequestStatus.FETCHING
  ) {
    return false
  }
  await cancelApiRequestFromActions(searchResultsApiStatusActions(searchType))
  await dispatch(searchResultsApiStatusActions(searchType).actions.inProgress)

  // books uses a different endpoint
  if (searchType === SearchTypesKeys.BOOKS) {
    if (query === '') {
      const results = { listings: [] }
      await dispatch(setSearchResults({ ...results, searchType }))
      await dispatch(searchResultsApiStatusActions(searchType).actions.success)
      return false
    }

    const response = await getMilqBookSearchResults(
      { query },
      makeRequestKeyFromActions(searchResultsApiStatusActions(searchType)),
    )

    if (response.ok) {
      const results = normalizeMilqBookSearchResultsResponseData(response.data)

      await dispatch(setSearchResults({ ...results, searchType }))
      await dispatch(searchResultsApiStatusActions(searchType).actions.success)
      return !!results.listings.length // this is used for barcode to figure out if successfully got results
    }
    dispatch(setSearchResults({ listings: [], searchType }))
    await dispatch(searchResultsApiStatusActions(searchType).actions.success)
    return false
  }

  const response = await getMilqSearchResults({ query, searchType })

  if (response.ok) {
    const results = normalizeMilqSearchResultsResponseData(response.data)
    if (searchType === SearchTypesKeys.ANSWERS) {
      const questionIds =
        (results.answers &&
          Object.values(results.answers).map((answer) => answer.questionId)) ||
        []
      await dispatch(fetchQuestionsByIdsAction(questionIds))
    }
    if (searchType === SearchTypesKeys.QUESTIONS) {
      await dispatch(setAnswersAction(results.recentAnswers))
    }

    await dispatch(setSearchResults({ ...results, searchType }))
  }

  await dispatch(searchResultsApiStatusActions(searchType).actions.success)
  return false
}

export const fetchMoreSearchResultsAction: (
  params: FetchSearchResultsActionParams,
) => ThunkedAction<State> = ({ query, searchType }) => async (
  dispatch,
  getState,
) => {
  if (
    searchResultsApiStatusSelector(getState(), { searchType }) ===
    RequestStatus.FETCHING
  ) {
    return
  }
  const { skip, canLoadMore } = searchListingByTypeSelector(getState(), {
    searchType,
  })

  if (!canLoadMore) {
    return
  }
  await dispatch(searchResultsApiStatusActions(searchType).actions.inProgress)

  // books uses a different endpoint
  if (searchType === SearchTypesKeys.BOOKS) {
    const response = await getMilqBookSearchResults({ query, skip })

    if (response.ok) {
      const results = normalizeMilqBookSearchResultsResponseData(response.data)
      await dispatch(setSearchMoreResults({ ...results, searchType }))
    }
    await dispatch(searchResultsApiStatusActions(searchType).actions.success)
    return
  }

  const response = await getMilqSearchResults({ query, skip, searchType })

  if (response.ok) {
    const results = normalizeMilqSearchResultsResponseData(response.data)
    if (searchType === SearchTypesKeys.ANSWERS) {
      const questionIds =
        (results.answers &&
          Object.values(results.answers).map((answer) => answer.questionId)) ||
        []
      await dispatch(fetchQuestionsByIdsAction(questionIds))
    }

    await dispatch(setSearchMoreResults({ ...results, searchType }))
  }
  await dispatch(searchResultsApiStatusActions(searchType).actions.success)
}
