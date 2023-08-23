import {
  BookAnswerResponseData,
  BookEANListResponseData,
  BookModel,
  BooksList,
  Ean,
} from 'src/models/BookModel'
import { normalizeAnswerData } from './nomalizeQuestions'
import Logger from 'src/helpers/logger'
import { getAvailabilityStatus } from 'src/endpoints/atgGateway/pdp/booksDetails'

const logger = Logger.getInstance()

export const normalizeBooksResult = (bookSearchResult) =>
  bookSearchResult.reduce(
    (result, book) => {
      // eslint-disable-next-line no-param-reassign
      result.booksList[book.ean] = {
        ean: book.ean,
        workId: book.workId,
        name: book.name,
        authors: book.authors,
        type: book.type,
        skuType: book.skuType,
      } as BookModel
      result.eans.push(book.ean)
      return result
    },
    {
      eans: [] as Ean[],
      booksList: {} as BooksList,
    } as BookEANListResponseData,
  )
// TODO determine if this is still used and how;
export const normalizeBook = (book): BookModel => ({
  ean: book.ean,
  workId: book.workId,
  name: book.name,
  authors: book.authors,
  type: book.type,
  skuType: book.skuType,
  availabilityStatus: getAvailabilityStatus(book.availabilityStatus),
  listPrice: 0,
  salePrice: 0,
  percentageSave: book.percentageSave,
  averageRating: book.averageRating,
  reviewCount: book.reviewCount,
  webReaderUrl: book.webReaderUrl,
})

export function normalizeBookAnswerResult(
  bookSearchResult: any,
): BookAnswerResponseData {
  const empty: BookAnswerResponseData = {
    eans: [],
    booksList: {},
    bookToAnswer: {},
    answers: {},
  }
  const eansSoFar = new Set<Ean>()
  return bookSearchResult.reduce((result, answer) => {
    if (!answer.customAttributes) {
      return result
    }
    const book = answer.customAttributes.product
    const answerId = answer._id
    const { ean } = book
    if (eansSoFar.has(ean)) {
      logger.info(
        `normalizeBookAnswerResult - answer ${answerId} ignored, as it repeats the answer of ean ${ean}`,
      )
      return result // Don't process the same book answer twice or more
    }
    eansSoFar.add(ean)

    normalizeAnswerData(answer)
    // eslint-disable-next-line no-param-reassign
    result.booksList[ean] = normalizeBook(book)
    result.eans.push(ean)
    // eslint-disable-next-line no-param-reassign
    result.bookToAnswer[ean] = answerId
    // eslint-disable-next-line no-param-reassign
    result.answers[answerId] = normalizeAnswerData(answer)
    return result
  }, empty)
}
