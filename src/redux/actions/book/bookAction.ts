import { State } from 'src/redux/reducers'
import PQueue from 'p-queue'
import { fetchBookRelatedQuestionsAction } from 'src/redux/actions/book/relatedQuestionsAction'

import { RequestStatus } from 'src/models/ApiStatus'
import { getBooksDetails, normalizeAtgBookDetailsToBookModelArray } from 'src/endpoints/atgGateway/pdp/booksDetails'
import { getBookModel, normalizeBookModelResponseData } from 'src/endpoints/milq/book'

import { Ean, BookModel } from 'src/models/BookModel'
import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import actionApiCall from 'src/helpers/redux/actionApiCall'

import { setBooksAction } from 'src/redux/actions/book/searchBookAction'

import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

const CONCURENCY = 8
const queue = new PQueue({ concurrency: CONCURENCY })

export const bookFetchApiStatusActions =
  makeApiActionsWithIdPayloadMaker('bookDetails', 'BOOKS__FETCH')


// Using Milq - More reliable to get a result, but only work for a *single* book.
export const fetchBookFromMilqAction: (ean: Ean) => ThunkedAction<State, APIResponse> =
  ean => async (dispatch, getState) => {
    const response = await actionApiCall(dispatch, bookFetchApiStatusActions(ean), () => getBookModel({ query: ean }))
    if (response.ok) {
      const book = normalizeBookModelResponseData(response.data)
      if (book) {
        const booksDict: Record<Ean, BookModel> = { [book.ean]: book }
        await dispatch(setBooksAction(booksDict))
      } else {
        logger.warn(`Book '${ean}' was not found using milq's external/barnes APIs`)
      }
    }
    return response
  }

// ATG - a bit gaster Faster, and fetches multiple books at the same time.
// - Also checks if a fetch is already in progress, and does not fetch if so.
// The ATG's QA books DB is not as well populated, though.
// Sometimes we get the "One or all EAN(s) provided is/are invalid" result
export const fetchBooksAction: (eans: Ean[]) => ThunkedAction<State> =
  eans => async (dispatch, getState) => {
    // Don't fetch books that are already in progress of fetching. Or a fetch was attempted recently.
    const bookFetchApiStatuses = getState().atg.api.bookFetch

    const notInProgressEans = eans.filter((ean) => {
      if (bookFetchApiStatuses[ean]) {
        // Check if Failed or not Fetched.
        return !bookFetchApiStatuses[ean].requestStatus ||
          bookFetchApiStatuses[ean].requestStatus === RequestStatus.FAILED
      }
      // Not fetched
      return true
    })

    // Anything left?
    if (notInProgressEans.length === 0) {
      // Nothing to fetch right now.
      return
    }

    // Mark all as in progress
    await dispatch(bookFetchApiStatusActions(notInProgressEans).actions.inProgress)

    // Fetch a book at a time (new API is a server-side cached GET)
    notInProgressEans.forEach((ean) => {
      queue.add(async () => {
        const response = await getBooksDetails([ean])
        if (response.ok && response.data.response.success) {
          const booksList = normalizeAtgBookDetailsToBookModelArray(response.data)
          if (booksList.length === 1) {
            const book = booksList[0]
            await dispatch(setBooksAction({ [book.ean]: book }))
          }
          await dispatch(bookFetchApiStatusActions(ean).actions.success)
        } else {
          // Attempt a fetch from Milq
          logger.info(`Missing Book from ATG: ${ean}`) // Suresh asked us to log and report
          await dispatch(fetchBookFromMilqAction(ean))
        }
      })
    })
  }


// Fetch a single book, and its related questions
export const fetchBookAndRelatedQuestionsAction: (ean: Ean) => ThunkedAction<State> =
  ean => async (dispatch, getState) => {
    const statePre = getState()
    const bookPre = statePre._legacybooks.booksList[ean]
    // If we need to fetch the book, do so.
    if (!bookPre || !bookPre.workId) {
      await dispatch(fetchBookFromMilqAction(ean))
    }
    const statePost = getState()
    const bookPost = statePost._legacybooks.booksList[ean]
    if (bookPost) {
      await dispatch(fetchBookRelatedQuestionsAction({ workId: String(bookPost.workId), ean }))
    }
  }
