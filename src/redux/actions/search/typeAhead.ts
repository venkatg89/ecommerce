import { State } from 'src/redux/reducers'

import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import {
  makeRequestKeyFromActions,
  cancelApiRequestFromActions,
} from 'src/helpers/redux/cancelTokenSources'
import { fetchSearchLookAhead, normalizeSearchLookAheadResponseData } from 'src/endpoints/atgGateway/search'
import { SearchTypeAheadModel } from 'src/models/SearchModel'

export const searchTypeAheadApiStatusActions = makeApiActions(
  'pdpSearchTypeAhead',
  'SEARCH__TYPE_AHEAD',
)

export const getSearchAutocompleteAction: (query: string) => ThunkedAction<State, undefined | SearchTypeAheadModel> = (
  query,
) => async (dispatch, getState) => {
  await cancelApiRequestFromActions(searchTypeAheadApiStatusActions)

  const response = await fetchSearchLookAhead(
    query,
    makeRequestKeyFromActions(searchTypeAheadApiStatusActions),
  )

  if (response.ok) {
    return normalizeSearchLookAheadResponseData(response.data)
  }
  return undefined
}
