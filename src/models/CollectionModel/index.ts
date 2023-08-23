import { Ean, BookModel } from 'src/models/BookModel'
import { ReadingStatusList } from '../ReadingStatusModel'

export type CollectionId = string

export interface CollectionBookModel {
  ean: Ean
  added: Date
}


export interface CollectionModel {
  id: string
  milqUserId: string
  name: string
  description: string
  public: boolean // If the collection is this user's - can be false. Otherwise always true when others'.
  books: Record<Ean, CollectionBookModel>
  createdDate: Date
  changedDate: Date
}

export interface CollectionEditModel {
  name?: string
  description?: string
  public?: boolean // If the collection is this user's - can be false. Otherwise always true when others'.
  books?: Record<Ean, Nullable<BookModel | {}>>
}


export type CollectionAndReadingStatusModel = (CollectionModel | ReadingStatusList)


export enum CollectionPrivacyNames {
  PRIVACY = 'privacy',
  PUBLIC = 'public'
}


export enum CollectionsSortNames {
  DATE_ADDED = 'date_added',
  A_Z = 'a-z'
}
