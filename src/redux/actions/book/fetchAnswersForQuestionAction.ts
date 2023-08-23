import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import { questionAnswersFeedApiStatusSelector } from 'src/redux/selectors/apiStatus/community'

import { normalizeBookAnswerResult } from 'src/helpers/api/milq/normalizeBookResult'
import { fetchAnswers } from 'src/endpoints/milq/communities/fetchAnswers'

import { BookEANListName } from 'src/models/BookModel'
import { RequestStatus } from 'src/models/ApiStatus'
import { RecommendationSortNames } from 'src/models/Communities/QuestionModel'

import { setBooksToAnswerAction } from '../communities/fetchCommentAction'

export const SET_BOOKS_ACTION = 'SET_BOOKS_ACTION'
export const SET_ANSWERS_ACTION = 'SET_ANSWERS_ACTION'
export const SET_BOOKS_EAN_LIST_ACTION = 'SET_BOOKS_EAN_LIST_ACTION'
export const RESET_BOOKS_EAN_LIST_ACTION = 'RESET_BOOKS_EAN_LIST_ACTION'
export const SET_MORE_BOOKS_EAN_LIST_ACTION = 'SET_MORE_BOOKS_EAN_LIST_ACTION'
export const SET_ANSWERS_AND_BOOKS_ACTOIN = 'SET_ANSWERS_AND_BOOKS_ACTOIN'

export const setBooksAction = makeActionCreator(SET_BOOKS_ACTION)
export const setAnswersAction = makeActionCreator(SET_ANSWERS_ACTION)
export const setBooksEANListAction = makeActionCreator(SET_BOOKS_EAN_LIST_ACTION)
export const resetBooksEANListAction = makeActionCreator(RESET_BOOKS_EAN_LIST_ACTION)
export const setMoreBooksEANListAction = makeActionCreator(SET_MORE_BOOKS_EAN_LIST_ACTION)
export const setAnswersAndBooksAction = makeActionCreator(SET_ANSWERS_AND_BOOKS_ACTOIN)

export const BOOKS_PER_PAGE = 10

export const questionAnswersFeedApiActions =
  makeApiActionsWithIdPayloadMaker('fetchAnswersForQuestionApiActions', 'FETCH_ANSWERS_FOR_QUESTION_API_ACTION')

// only answer use special sort names (recnet and popular)
const parseSort = sort => (sort === 'mostanswered' ? 'popular' : sort)

export const fetchAnswersForQuestionAction:
  (questionId: string, _sort?: RecommendationSortNames) => ThunkedAction<State> =
  (questionId, _sort = RecommendationSortNames.RECENT) => async (dispatch, getState) => {
    await dispatch(questionAnswersFeedApiActions(questionId).actions.inProgress)
    const sort = parseSort(_sort)
    const name = `${BookEANListName.QUESTION_ANSWERS}${questionId}`
    await dispatch(resetBooksEANListAction(name))
    const params = {
      question: questionId,
      from: 0,
      limit: BOOKS_PER_PAGE,
      sort,
    }
    const response = await fetchAnswers(params)
    if (response.ok) {
      const { eans, booksList, bookToAnswer, answers } = normalizeBookAnswerResult(response.data)
      await Promise.all([
        dispatch(setBooksAction(booksList)),
        dispatch(setBooksEANListAction({ name, eans })),
        dispatch(setAnswersAction(answers)),
        dispatch(setBooksToAnswerAction({ questionId, bookToAnswerList: bookToAnswer })),
        dispatch(questionAnswersFeedApiActions(questionId).actions.success)])
    } else {
      // TODO signal error
      await dispatch(questionAnswersFeedApiActions(questionId).actions.failed)
    }
  }


export const fetchMoreAnswersForQuestionAction:
    (questionId: string, _sort?: RecommendationSortNames) => ThunkedAction<State> =
    (questionId, _sort = RecommendationSortNames.RECENT) => async (dispatch, getState) => {
      const state:State = getState()
      const status = questionAnswersFeedApiStatusSelector(state, { id: questionId })
      const name = `${BookEANListName.QUESTION_ANSWERS}${questionId}`
      const { skip, canLoadMore } = state.listings.bookLists.bookEANList[name]
      if (!canLoadMore || status === RequestStatus.FETCHING) {return}
      const sort = parseSort(_sort)
      await dispatch(questionAnswersFeedApiActions(questionId).actions.inProgress)
      const params = {
        question: questionId,
        from: skip,
        limit: BOOKS_PER_PAGE,
        sort,
      }
      const response = await fetchAnswers(params)
      if (response.ok) {
        const { eans, booksList, bookToAnswer, answers } = normalizeBookAnswerResult(response.data)
        await Promise.all([
          dispatch(setBooksAction(booksList)),
          dispatch(setAnswersAction(answers)),
          dispatch(setMoreBooksEANListAction({ name, eans })),
          dispatch(setBooksToAnswerAction({ questionId, bookToAnswerList: bookToAnswer })),
          dispatch(questionAnswersFeedApiActions(questionId).actions.success)])
      } else {
        // TODO signal error
        await dispatch(questionAnswersFeedApiActions(questionId).actions.failed)
      }
    }
