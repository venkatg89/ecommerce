import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import actionApiCall from 'src/helpers/redux/actionApiCall'

import {
  getBookDescription,
  normalizeBookDescriptionResponseData,
  normalizeTabsInfoResponseData,
} from 'src/endpoints/atgGateway/pdp/bookDescription'
import {
  getBookAvailableFomats,
  normalizeBookAvailableFormatsResponseData,
} from 'src/endpoints/atgGateway/pdp/bookAvailableFormats'

import {
  getSearchDetails,
  normalizeSalesRank,
} from 'src/endpoints/atgGateway/pdp/getSearchDetails'

import { BookDetailsPayload } from 'src/redux/reducers/PdpReducer/BookDetailsReducer'
import { Ean } from 'src/models/BookModel'
import { BookDetails } from 'src/models/PdpModel'

export const bookDetailsApiStatusActions = makeApiActionsWithIdPayloadMaker(
  'bookDetails',
  'PDP__BOOK_DETAILS',
)

export const SET_PDP_BOOK_DETAILS = 'BOOK__DETAILS_SET'
const setBookDetails = makeActionCreator<BookDetailsPayload>(
  SET_PDP_BOOK_DETAILS,
)

export const fetchBookDetailsAction: (ean: Ean) => ThunkedAction<State> = (
  ean,
) => async (dispatch, getState) => {
  let responses: APIResponse[] = []
  await actionApiCall(dispatch, bookDetailsApiStatusActions(ean), async () => {
    responses = await Promise.all([
      getBookDescription(ean),
      getBookAvailableFomats(ean),
      getSearchDetails(ean),
    ])
    return responses[0] // the main reply to the call
  })

  if (responses[0].ok) {
    const bookDescription = normalizeBookDescriptionResponseData(
      responses[0].data,
    )
    const availableFormats = normalizeBookAvailableFormatsResponseData(
      responses[1].data,
    )
    const bookTabs = normalizeTabsInfoResponseData(responses[0].data)
    const salesRank = normalizeSalesRank(responses[2].data)

    const bookDetails: BookDetails = {
      ean: ean,
      description: bookDescription,
      bookTabs: bookTabs,
      availableFormats,
      salesRank: salesRank,
    }

    await dispatch(setBookDetails({ ean, bookDetails }))
  }
}
