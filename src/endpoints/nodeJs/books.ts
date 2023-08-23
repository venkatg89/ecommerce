import nodeJsApiRequest from 'src/apis/nodeJs'
import { excludeUserBooksSelector } from 'src/redux/selectors/myBooks/booksSelector'
import { shuffleObject } from 'src/helpers/shuffleHelper'
import { Ean } from 'src/models/BookModel'

export enum ContentName {
  NEW_RELEASES = 'newReleases',
  BESTSELLERS = 'bestsellers',
  COMING_SOON = 'comingSoon',
}

export const ContentTitle = {
  [ContentName.NEW_RELEASES]: 'New Releases',
  [ContentName.BESTSELLERS]: 'Bestselling',
  [ContentName.COMING_SOON]: 'Coming Soon',
}

/**
 * Retrieves books by BN subjects
 * @param {Array} ids list of categories/interests IDs
 */
export const getCategoryBooks = (ids: number[]) =>
  nodeJsApiRequest({
    method: 'GET',
    endpoint: `/v1/cache/interests/get?interestIds=${ids.join()}`,
  })

export const normalizeCategoryBooksResponse = (state, response) => {
  let booksDetails = {}
  let result = {}
  Object.keys(response.data).map((interestId) => {
    const { books } = response.data[interestId]
    if (books) {
      Object.keys(books).map((section) => {
        const _excludeUserBooksSelector = excludeUserBooksSelector()
        const excludedBooks = _excludeUserBooksSelector(state, {
          books: books[section],
        })
        const sectionBooks = shuffleObject(excludedBooks)
        const eans = Object.keys(sectionBooks)
        if (eans.length) {
          result = {
            ...result,
            [interestId]: {
              ...(result[interestId] || {}),
              [section]: eans,
            },
          }

          booksDetails = {
            ...booksDetails,
            ...sectionBooks,
          }
        }

        return section
      })
    }

    return interestId
  })

  return {
    booksDetails,
    result,
  }
}

/**
 * Retrieves books by BN content
 * @param {String} data.contentName Name of the content to be returned ("newReleases", "bestsellers", "comingSoon")
 * @param {Array} data.filterEan EANs of books already read by anonymous user
 */
export const getContentBooks = (ids: string[]) =>
  nodeJsApiRequest({
    method: 'GET',
    endpoint: `/v1/cache/content/get?contentIds=${ids.join()}`,
  })

export const normalizeContentBooksResponse = (state, response) => {
  let booksDetails = {}
  let result = {}
  Object.keys(response.data).map((contentId) => {
    const { books } = response.data[contentId]
    if (books) {
      const _excludeUserBooksSelector = excludeUserBooksSelector()
      const unshuffled = _excludeUserBooksSelector(state, { books })
      const userBooks = shuffleObject(unshuffled)
      const eans = Object.keys(userBooks)
      if (eans.length) {
        result = {
          ...result,
          [contentId]: eans,
        }

        booksDetails = {
          ...booksDetails,
          ...books,
        }
      }
    }

    return contentId
  })

  return {
    booksDetails,
    result,
  }
}

/**
 * Retrieves more from author books
 * @param {Array} req.body.eanList list of EANs
 * @param {Array} req.body.filterEan EANs of books already read by anonymous user
 */
export const getAuthorRelatedBooks = (ean: Ean) =>
  nodeJsApiRequest({
    method: 'GET',
    endpoint: `/v1/cache/authors/get?ean=${ean}`,
  })

interface CurrentlyReadingUsersFromWorkIdParams {
  workId: number
}

export const getCurrentlyReadingUsersFromWorkId = ({
  workId,
}: CurrentlyReadingUsersFromWorkIdParams) =>
  nodeJsApiRequest({
    method: 'GET',
    endpoint: '/v1/books/currentlyReading',
    params: {
      workId,
    },
  })
