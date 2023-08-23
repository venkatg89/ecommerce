import { State } from 'src/redux/reducers'

import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import {
  QuestionResponseData, RecommendationFilterNames, RecommendationSortNames,
} from 'src/models/Communities/QuestionModel'
import { RequestStatus } from 'src/models/ApiStatus'

import { normalizeQuestionsReponseData } from 'src/helpers/api/milq/nomalizeQuestions'
import { fetchQafeed } from 'src/endpoints/milq/communities/fetchQafeed'

import { communityCategoryFeedApiStatusSelector } from 'src/redux/selectors/apiStatus/community'
import { setQuestionsAction } from 'src/redux/actions/communities/recommendationAction'
import { setAnswersAction } from 'src/redux/actions/book/fetchAnswersForQuestionAction'

export const SET_CATEGORY_QUESTION_IDS_ACTION = 'SET_CATEGORY_QUESTION_IDS_ACTION'
export const SET_MORE_CATEGORY_QUESTION_IDS_ACTION = 'SET_MORE_CATEGORY_QUESTION_IDS_ACTION'

export const setCategoryQuestionIdsAction = makeActionCreator(SET_CATEGORY_QUESTION_IDS_ACTION)
export const setMoreCategoryQuestionsIdsAction = makeActionCreator(SET_MORE_CATEGORY_QUESTION_IDS_ACTION)

export const communityCategoryFeedApiActions =
  makeApiActionsWithIdPayloadMaker('communityCategoryFeed', 'COMMUNITY__CATEGORY_FEED')

export const QUESTION_PER_PAGE = 10

const fetchAndNormalizeQafeed = async (_params, categoryId) => {
  const params = { ..._params, community: categoryId }
  try {
    const response = await fetchQafeed(params)
    const {
      answers,
      questions,
      questionIds,
    } = normalizeQuestionsReponseData(response.data) as QuestionResponseData
    return { questions, questionIds, answers }
  } catch { return null }
}


export const fetchCategoryQaFeedAction:
(categoryId: string, sort: RecommendationSortNames, filter: RecommendationFilterNames) => ThunkedAction<State> =
  (categoryId, sort, filter) => async (dispatch, getState) => {
    const state = getState()
    const myUid = (state.user && state.user.profile && state.user.profile.uid)

    const params = {
      from: 0,
      limit: QUESTION_PER_PAGE,
      sort,
      uid: filter === RecommendationFilterNames.MY_POST ? myUid : null,
    }

    try {
      await dispatch(communityCategoryFeedApiActions(categoryId).actions.inProgress)
      const result = await fetchAndNormalizeQafeed(params, categoryId)
      if (result) {
        const {
          questions,
          questionIds,
          answers,
        } = result
        await Promise.all([
          dispatch(setAnswersAction(answers)),
          dispatch(setQuestionsAction(questions)),
          dispatch(setCategoryQuestionIdsAction({ filter: `${filter}-${sort}-${categoryId}`, ids: questionIds })),
          dispatch(communityCategoryFeedApiActions(categoryId).actions.success)])
      }
    } catch { /* */ }
  }


export const fetchMoreCateogryQuestionsActions:
(categoryId:string, sort: RecommendationSortNames, filter: RecommendationFilterNames) => ThunkedAction<State> =
(categoryId, sort, filter) => async (dispatch, getState) => {
  const state: State = getState()
  const key = `${filter}-${sort}-${categoryId}`
  const { categoryQuestionsList } = state.listings.communityLists
  const { skip, canLoadMore } = categoryQuestionsList[key]
  const status = communityCategoryFeedApiStatusSelector(state, { id: categoryId })
  if (!canLoadMore || status === RequestStatus.FETCHING) {return}
  const params = {
    from: skip,
    limit: QUESTION_PER_PAGE,
    sort,
  }
  try {
    await dispatch(communityCategoryFeedApiActions(categoryId).actions.inProgress)
    const result = await fetchAndNormalizeQafeed(params, categoryId)
    if (result) {
      const {
        questions,
        questionIds,
        answers,
      } = result
      await Promise.all([
        dispatch(setAnswersAction(answers)),
        dispatch(setQuestionsAction(questions)),
        dispatch(setMoreCategoryQuestionsIdsAction({ filter: key, ids: questionIds })),
        dispatch(communityCategoryFeedApiActions(categoryId).actions.success)])
    }
  } catch (error) { /* */ }
}
