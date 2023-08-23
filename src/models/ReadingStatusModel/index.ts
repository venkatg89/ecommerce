import { Ean, NookListItem } from 'src/models/BookModel'
import { CollectionBookModel } from 'src/models/CollectionModel'

// Please sync these with Node Storage
export enum ReadingStatus {
  TO_BE_READ = 'wtr',
  READING = 'reading',
  FINISHED = 'read',
}

export interface ReadingStatusListItem {
  ean: Ean
  reading: ReadingStatus
  addedDate: Date
  changeDate: Date
}

export type ReadingStatusListUpdate = Record<Ean, ReadingStatusListItemUpdate>

export interface ReadingStatusListItemUpdate {
  pos?: Number
  total?: Number // Total pages in a book.
  status: Nullable<ReadingStatus>;
  workId?: number; // TODO: remove this and move it to endpoint param, missing `nodeJsBuildPiggyBackReadingStatusList`
}

export type NotInterestedListUpdate = Record<Ean, Nullable<NotInterestedListItemUpdate>>

export interface NotInterestedListItemUpdate {}


export interface ReadingStatusList {
  books: Record<Ean, ReadingStatusListItem | CollectionBookModel | NookListItem>
  changedDate: Date
  name: string
  id: ReadingStatus
  milqUserId: string
  description?: string
  public?: boolean
}
