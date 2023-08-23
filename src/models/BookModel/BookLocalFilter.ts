import { BookListFormatNames } from 'src/models/MyBooks/BookListSortFilter'
import { ReadingStatus } from 'src/models/ReadingStatusModel'

export interface BookLocalFilterModel {
  // Search Term - use '' if none
  searchTerm: string

  // Book format: audiobook, eBook
  formatFilter: BookListFormatNames

  // Reading Statuses - use [] if all (as 'none' makes no sense here)
  readingStatuses: ReadingStatus[]
}
