import { Ean } from '../BookModel'
import { ReadingStatus } from '../ReadingStatusModel'
import { CollectionModel } from '../CollectionModel'


export enum NotificationType{
  QUESTION = 'questions',
  ANSWER = 'answers',
  AGREEDANSWER = 'agree',
  HISTORY='history',
  COLLECTION_CREATED = 'CollectionCreated',
  COLLECTION_BOOK_ADDED = 'CollectionBookAdded',
  READING_STATUS_UPDATE = 'ReadingListBookSet',
}

export interface Collection{ name: string, books: string[]}

export interface StatusUpdate{ ean:Ean, status: ReadingStatus}

export interface CollectionBookAdded{
  addedBook: Ean
  collection: CollectionModel,
  creationDate: Date,
  uid: string,
  type: string,
}
export interface CollectionCreated{
  collection: CollectionModel,
  creationDate: Date,
  uid: string,
  type: string,
}

export interface ReadingStatusUpdate{
  statusUpdates: StatusUpdate
  creationDate: Date,
  uid: string,
  type: string,
}

export type NotificationData = CollectionBookAdded | CollectionCreated | ReadingStatusUpdate

export interface NotificationItem{
  type:NotificationType,
  creationDate: Timestamp,
  data: Number | NotificationData
}

export interface HistoryResponseData {
  eans: string[],
  posts: Array<any>
}
