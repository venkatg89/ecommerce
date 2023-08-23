import { ReadingStatus, ReadingStatusList } from 'src/models/ReadingStatusModel'
import { ReadingStatusBook } from 'src/models/BookModel'


export const getListFromReadingStatus = (readingStatus:ReadingStatusBook[], milqId: string, privacy?) => {
  const read: ReadingStatusList = {
    changedDate: new Date(0),
    books: {},
    name: 'Finished',
    id: ReadingStatus.FINISHED,
    milqUserId: milqId,
    public: privacy ? privacy[ReadingStatus.FINISHED] : true,
  }
  const reading: ReadingStatusList = {
    changedDate: new Date(0),
    books: {},
    name: 'Reading',
    id: ReadingStatus.READING,
    milqUserId: milqId,
    public: privacy ? privacy[ReadingStatus.READING] : true,
  }
  const wantToRead: ReadingStatusList = {
    changedDate: new Date(0),
    books: {},
    name: 'To Be Read',
    id: ReadingStatus.TO_BE_READ,
    milqUserId: milqId,
    public: privacy ? privacy[ReadingStatus.TO_BE_READ] : true,
  }
  readingStatus.forEach((book: ReadingStatusBook) => {
    switch (book.reading) {
      case ReadingStatus.FINISHED: {
        if (new Date(book.changeDate).getTime() > new Date(read.changedDate).getTime()) {read.changedDate = book.changeDate}
        read.books[book.ean] = book
        break
      }
      case ReadingStatus.READING: {
        if (new Date(book.changeDate).getTime() > new Date(reading.changedDate).getTime()) {reading.changedDate = book.changeDate}
        reading.books[book.ean] = book
        break
      }
      case ReadingStatus.TO_BE_READ: {
        if (new Date(book.changeDate).getTime() > new Date(wantToRead.changedDate).getTime()) {wantToRead.changedDate = book.changeDate}
        wantToRead.books[book.ean] = book
        break
      }
      default: break
    }
  })
  return { reading, read, wantToRead }
}
