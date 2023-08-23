import { RequestStatus } from 'src/models/ApiStatus'
import { State } from 'src/redux/reducers'
import { isFullBookModel, asEan, Ean, BookOrEan } from 'src/models/BookModel'

export const fetchingBooksApiStatus = (stateAny, props) => {
  const state = stateAny as State
  const booksOrEansT: BookOrEan[] = props.booksOrEans
  if (!Array.isArray(booksOrEansT)) {
    return false
  }

  const bookFetchApiState = state.atg.api.bookFetch
  const toFetch: Ean[] = booksOrEansT
    .filter((bookOrEan) => !isFullBookModel(bookOrEan))
    .map((bookOrEan) => asEan(bookOrEan))
  if (toFetch.length < 1) {
    return false
  }

  return toFetch.every((ean) => {
    if (
      bookFetchApiState[ean] &&
      bookFetchApiState[ean].requestStatus === RequestStatus.SUCCESS
    ) {
      return false
    }
    return true
  })
}

export const browseDetailsApiStatus = (stateAny: any) => {
  const state = stateAny as State
  return state.atg.api.browseDetails.requestStatus
}
