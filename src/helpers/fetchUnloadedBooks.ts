import { Ean, BookOrEan, asEan, isFullBookModel } from 'src/models/BookModel'

// Fetches books that are passed in as EAN, and don't fetch ones thar are already a book model.
export default (booksOrEans: BookOrEan[], fetchBooksAction: (eans: Ean[]) => void) => {
  // Filter out the already present books

  const toFetch = booksOrEans
    .filter(bookOrEan => !isFullBookModel(bookOrEan))
    .map(bookOrEan => asEan(bookOrEan))

  // And fetch them.
  fetchBooksAction(toFetch)
}
