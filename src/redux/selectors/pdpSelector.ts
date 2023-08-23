import { createSelector } from 'reselect'

import { bookSelector } from 'src/redux/selectors/booksListSelector'
import { State } from 'src/redux/reducers'

import { RequestStatus } from 'src/models/ApiStatus'

const EMPTY_ARRAY = []

export const pdpBookDetailsSelector = (state: State) => {
  return state.pdp.bookDetails || EMPTY_ARRAY
}

export const pdpBookRelatedQuestionsSelector = () =>
  createSelector(
    (state, ownProps) => state.communities.questions,
    (state, ownProps) =>
      state.pdp.bookRelatedQuestionIdList[ownProps.ean] || EMPTY_ARRAY,
    (questions, questionIds) =>
      questionIds.map((questionId) => questions[questionId]),
  )

export const pdpBookRelatedQuestionIdsSelector = (
  state: State,
  props,
): string[] => {
  const { ean } = props
  return state.pdp.bookRelatedQuestionIdList[ean] || EMPTY_ARRAY
}

export const pdpBookRecommendedBookIdsSelector = (
  state: State,
  props,
): string[] => {
  const { ean } = props
  return state.pdp.bookRecommendedBookIdList[ean] || EMPTY_ARRAY
}

export const currentlyReadingUserIdsFromEanSelector = (
  state: State,
  ownProps,
): string[] => {
  const { ean } = ownProps
  const book = bookSelector(state, { ean })
  return state.pdp.workIdReadingList[book.workId || -1] || EMPTY_ARRAY
}

export const currentlyReadingUserIdsFromWorkIdSelector = (
  state: State,
  ownProps,
): string[] => {
  const { workId } = ownProps
  return state.pdp.workIdReadingList[workId] || EMPTY_ARRAY
}

export const isBusyFetchingPdp = (state: State, ownProps): boolean => {
  const { ean } = ownProps
  const requestStatus =
    state.atg.api.bookDetails[ean] &&
    state.atg.api.bookDetails[ean].requestStatus
  return requestStatus === RequestStatus.FETCHING
}

export const recentlyViewedSelector = (stateAny: any): string[] => {
  const state = stateAny as State
  return state.pdp.recentlyViewed
}

export const browseDetailsSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.pdp.browseDetails
}

export const recommendedProductsSelector = (stateAny: any): string[] => {
  const state = stateAny as State
  return state.pdp.recommendedForYouProducts
}

export const nookDeviceSpecSelector = (stateAny: any): string => {
  const state = stateAny as State
  return state.pdp.nookDeviceSpecifications
}

export const reviewsSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.pdp.reviews
}
