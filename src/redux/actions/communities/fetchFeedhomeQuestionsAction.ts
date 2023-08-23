import { State } from 'src/redux/reducers'

import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import actionApiCall from 'src/helpers/redux/actionApiCall'
import {
  fetchHomeFeed,
} from 'src/endpoints/milq/communities/fetchHomeFeed'
import { RecommendationSortNames } from 'src/models/Communities/QuestionModel'
import { RequestStatus } from 'src/models/ApiStatus'
import { communityHomeFeedApiStatusSelector } from 'src/redux/selectors/apiStatus/community'
import { normalizeFeedData } from 'src/helpers/api/milq/nomalizeQuestions'

export const QUESTION_PER_PAGE = 10

export const communityHomeFeedApiActions =
  makeApiActions('communityHomeFeed', 'COMMUNITY__HOME_FEED')

export const SET_HOME_FEED_ACTION = 'SET_HOME_FEED_ACTION'
export const SET_MORE_HOME_FEED_ACTION = 'SET_MORE_HOME_FEED_ACTION'

export const setHomeFeedAction = makeActionCreator(SET_HOME_FEED_ACTION)
export const setMoreHomeFeedAction = makeActionCreator(SET_MORE_HOME_FEED_ACTION)


export const fetchFeedQuestionsAction: (sort: RecommendationSortNames) => ThunkedAction<State> =
  (sort = RecommendationSortNames.RECENT) => async (dispatch, getState) => {
    const params = {
      from: 0,
      limit: QUESTION_PER_PAGE,
      sort,
    }
    try {
      const response = await actionApiCall(dispatch, communityHomeFeedApiActions, () => fetchHomeFeed(params))
      if (response.ok && response.data && response.data.dictionary) {
        const feedData = response.data
        const normalized = normalizeFeedData(feedData)
        const { questions, questionIds, answers } = normalized
        dispatch(setHomeFeedAction({ answers, questions, ids: questionIds }))
      }
    } catch (e) { /**/ }
  }

export const fetchFeedQuestionMore: (sort: RecommendationSortNames) => ThunkedAction<State> =
  (sort = RecommendationSortNames.RECENT) => async (dispatch, getState) => {
    const state: State = getState()
    const status = communityHomeFeedApiStatusSelector(state)
    const { skip, canLoadMore } = state.listings.communityLists.homeQuestionsList

    if (!canLoadMore || status === RequestStatus.FETCHING) {return}
    const params = {
      from: skip,
      limit: QUESTION_PER_PAGE,
      sort,
    }
    try {
      const response = await actionApiCall(dispatch, communityHomeFeedApiActions, () => fetchHomeFeed(params))
      if (response.ok) {
        const feedData = response.data
        const normalized = normalizeFeedData(feedData)
        const { questions, questionIds, answers } = normalized
        dispatch(setMoreHomeFeedAction({ answers, questions, ids: questionIds }))
      }
    } catch (e) { /**/ }
  }
