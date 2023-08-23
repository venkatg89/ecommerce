import { createSelector } from 'reselect'

import { State } from 'src/redux/reducers'

import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'
import {
  BookEANListName,
  BookModel,
  Ean,
  BookOrEan,
} from 'src/models/BookModel'
import { ContentName } from 'src/endpoints/nodeJs/books'

const EMPTY_OBJECT = {}
const EMPTY_ARRAY = []

export const booksListSelector = (stateAny, props) => {
  const state = stateAny as State
  const { booksList } = state._legacybooks
  const eans = props.eans as Ean[]
  return (eans.length && eans.map((ean) => booksList[ean])) || EMPTY_ARRAY
}

// booksListSelector, but unloaded books return ean, instead of undefined.
export const booksOrEanListSelector = (stateAny, props): BookOrEan[] => {
  const state = stateAny as State
  const { booksList } = state._legacybooks
  const eans = props.eans as Ean[]
  return (
    (eans.length && eans.map((ean) => booksList[ean] || ean)) || EMPTY_ARRAY
  )
}

export const bookSelector = (stateAny, props): BookModel => {
  const state = stateAny as State
  const { ean } = props
  return state._legacybooks.booksList[ean] || EMPTY_OBJECT
}

export const workIdFromEanSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const book = bookSelector(state, ownProps)
  return book.workId
}

export const bookForAnswerSelector = (stateAny, props) => {
  const state = stateAny as State
  const { answerId } = props
  const answer = state.communities.answers[answerId]
  if (answer) {
    return state._legacybooks.booksList[answer.product.ean] || null
  }
  return null
}

export const booksListSearchResultSelector = (stateAny: any, props: any) => {
  const state = stateAny as State
  const { questionId } = props
  return (
    state._legacybooks.bookToQuestionSearchResults[questionId] ||
    (EMPTY_ARRAY as any)
  )
}

export const bookListFromEANListSelector = (stateAny, props) => {
  const state = stateAny as State
  const { bookListName } = props
  const { booksList } = state._legacybooks
  const { bookEANList } = state.listings.bookLists
  const eans = bookEANList[bookListName] && bookEANList[bookListName].ids
  return (
    (eans && eans.length && eans.map((ean) => booksList[ean])) || EMPTY_ARRAY
  )
}

export const bookListForQuestionSelector = (stateAny: any, props: any) => {
  const state = stateAny as State
  const { questionId } = props
  const { booksList } = state._legacybooks
  const filter = `${BookEANListName.QUESTION_ANSWERS}${questionId}`
  const { bookEANList } = state.listings.bookLists
  const eans =
    (bookEANList[filter] && bookEANList[filter].ids) || (EMPTY_ARRAY as Ean[])
  return (eans.length && eans.map((ean) => booksList[ean])) || EMPTY_ARRAY
}

export const bookToAnswerSelector = (stateAny, props) => {
  const state = stateAny as State
  const { questionId } = props
  return state._legacybooks.bookToAnswer[questionId]
}

export const bookToCategorySelector = (stateAny, props) => {
  const state = stateAny as State
  const { categoryId } = props
  return state._legacybooks.bookToCategory[categoryId] || EMPTY_OBJECT
}

export const bookOrEanLocalFilterSelector = (
  stateAny: any,
  props,
): BookOrEan[] => ([])

export const booksByInterestSelector = (
  state: State,
  interestId: number,
  contentName?: ContentName,
) => {
  const interest = state._legacybooks.booksByInterest[interestId]
  if (interest) {
    if (contentName) {
      return interest[contentName] || EMPTY_ARRAY
    }

    return interest
  }

  return contentName ? EMPTY_ARRAY : EMPTY_OBJECT
}

export const featuredRecommendationsSelector = (state) =>
  state._legacybooks.featuredRecommendations || EMPTY_ARRAY

export const bookRecommendationsSelector = (state: State, ean: Ean) =>
  state._legacybooks.bookRecommendations[ean] || null

export const booksByContentSelector = (
  state: State,
  contentName: ContentName,
) => state._legacybooks.booksByContent[contentName] || EMPTY_ARRAY

export const booksDetailsSelector = () =>
  createSelector(
    (state: State) => state._legacybooks.booksList || EMPTY_OBJECT,
    (_, ownProps) => ownProps.eans,
    (booksList, eans) =>
      eans.reduce((acc, ean) => {
        const details = booksList[ean]
        if (details) {
          acc[ean] = details
        }
        return acc
      }, {}),
  )

export const nookLibraryByUidSelector = (stateAny: any, props: any) => {
  const state = stateAny as State
  const { milqId } = props
  const nookList = state.listings.users.nookLocker
  return nookList[milqId] || EMPTY_ARRAY
}

export const nookEansSelector = (stateAny: any) => {
  const state = stateAny as State
  const myMilqId = getMyProfileUidSelector(state)
  const nookList = nookLibraryByUidSelector(state, { milqId: myMilqId })
  return nookList
}

export const bookInNookLibrarySelector = () =>
  createSelector(bookSelector, nookEansSelector, (book, nookList) =>
    nookList.filter((nook) => nook.workId === book.workId),
  )
