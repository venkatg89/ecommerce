import { AnswerId, AnswerModel } from 'src/models/Communities/AnswerModel'
import {
  ReadingStatus,
  ReadingStatusListItem,
} from 'src/models/ReadingStatusModel'
import { makeBookImageURL, makeProductURLFull } from 'src/helpers/generateUrl'

export type Ean = string

export type AvailabilityStatus =
  | 'inStock'
  | 'outOfStock'
  | 'preorder'
  | 'backorder'

// TODO: modify to fit the new book details page, add description, rating etc
export interface BookModel {
  ean: Ean
  workId?: number // legacy?
  name: string
  authors: ContributorsModel
  type: string
  skuType: string
  description?: string
  imageList?: [string]
  listPrice: number
  salePrice: number
  percentageSave: string
  availabilityStatus: AvailabilityStatus
  averageRating: number
  reviewCount: number
  parentFormat?: string
  webReaderUrl: string
  publisher?: string
}

export type ContributorModel = {
  name: string
  url: string
}

export interface ContributorsModel {
  directors: ContributorModel[]
  cast: ContributorModel[]
  contributors: ContributorModel[]
}

export interface BookModelForMilq extends BookModel {
  productURL: string
  imageURL: string
}

export type BooksList = Record<Ean, BookModel>

export type BookOrEan = BookModel | Ean
export const isFullBookModel = (bookOrEan: BookOrEan | null | undefined) =>
  typeof bookOrEan === 'object'
export const asBookModel = (bookOrEan: BookOrEan | null | undefined) =>
  typeof bookOrEan === 'object' ? bookOrEan : undefined
export const asEan = (bookOrEan: BookOrEan) =>
  typeof bookOrEan === 'object' ? bookOrEan.ean : bookOrEan
export const keyFromBookArray = (array: BookOrEan[]) =>
  array.reduce((a: string, e: BookOrEan) => `${a},${asEan(e)}`, 'list')

export const asBookModelForMilq = (book: BookModel) => {
  const bookForMilq: BookModelForMilq = {
    ...book,
    imageURL: makeBookImageURL(book, 'thumb'),
    productURL: makeProductURLFull(book),
  }
  return bookForMilq
}

export interface BookEANListResponseData {
  eans: Ean[]
  booksList: BooksList
}

export type BookToCategoryRecord = Record<Ean, AnswerId>
export type BookToAnswerRecord = Record<AnswerId, Ean>

export interface BookAnswerResponseData {
  eans: Ean[]
  booksList: BooksList
  bookToAnswer: BookToAnswerRecord
  answers: Record<AnswerId, AnswerModel>
}

export enum BookEANListName {
  SEARCH_RESULT = 'search_result',
  CATEGORY_ANSWERS = 'category-',
  QUESTION_ANSWERS = 'question-',
}

export type BookEANList = {
  items: Ean[]
  skip: number
  canLoadMore: boolean
}

export type NookListItem = {
  type: string
  title: string
  author: ContributorsModel
  addedDate: Date
  changeDate: Date
  ean: Ean
  reading: ReadingStatus
  workId: number
}

export type ReadingStatusBook = ReadingStatusListItem | NookListItem
