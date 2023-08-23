import { State } from 'src/redux/reducers'

import { fetchUserPosts, normalizeUserPostsResponseData } from 'src/endpoints/milq/communities/fetchUserPosts'
import { getBooksDetails, normalizeAtgBookDetailsToBookModelArray } from 'src/endpoints/atgGateway/pdp/booksDetails'

import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { setBooksAction } from '../book/searchBookAction'
import { setAnswersAction } from 'src/redux/actions/book/fetchAnswersForQuestionAction'
import { setQuestionsAction } from 'src/redux/actions/communities/recommendationAction'
import { fetchAnswersByIdsAction } from 'src/redux/actions/communities/fetchAnswersByIdsAction'
import { fetchQuestionsByIdsAction } from 'src/redux/actions/communities/fetchQuestionsByIdAction'

import { RecommendationSortNames } from 'src/models/Communities/QuestionModel'

import { booksDetailsSelector } from 'src/redux/selectors/booksListSelector'
import { fetchUserPostApiStatusSelector } from 'src/redux/selectors/apiStatus/community'

import { AnswerId } from 'src/models/Communities/AnswerModel'
import { RequestStatus } from 'src/models/ApiStatus'


export const fetchMyPostApiActions =
makeApiActionsWithIdPayloadMaker('fetchMyPostApiActions', 'COMMUNITY_FETCH_MY_POST')

export const SET_USER_POSTS_LIST_ACTION = 'SET_USER_POST_LIST_ACTION'
export const SET_MORE_USER_POSTS_LIST_ACTION = 'SET_MORE_USER_POSTS_LIST_ACTION'

export const setUserPostsAction = makeActionCreator(SET_USER_POSTS_LIST_ACTION)
export const setMoreUserPostsAction = makeActionCreator(SET_MORE_USER_POSTS_LIST_ACTION)

export const POST_PER_PAGE = 10


export const fetchAndSetQuestionsAndAnswers = async (dispatch, uid, params, state) => {
  try {
    dispatch(fetchMyPostApiActions(uid).actions.inProgress)
    const response = await fetchUserPosts(params)
    const { answers, questions, userPosts } = normalizeUserPostsResponseData(response.data)
    const answerQuestionIds = [...new Set(Object.values(answers).map(answer => answer.questionId))]
    const recentAnswersIds = Object.values(questions)
      .reduce((result, question) => {
        if (!question.recentAnswerIds) {return result}
        return [...new Set(result.concat(question.recentAnswerIds))]
      }, [] as AnswerId[])
    const eans = Object.values(answers)
      .filter(item => item && item.product && item.product.ean)
      .map(item => item.product.ean)
    const _booksDetailsSelector = booksDetailsSelector()
    let books = _booksDetailsSelector(state, { eans })
    const missing = eans.filter(item => !books[item])


    if (missing.length) {
      const detailsResponse = await getBooksDetails(missing)
      if (detailsResponse.ok && detailsResponse.data.response.success) {
        books = {
          ...normalizeAtgBookDetailsToBookModelArray(detailsResponse.data).reduce((acc, val) => {
            acc[val.ean] = val
            return acc
          }, {}),
        }
      }
      await dispatch(setBooksAction(books))
    }

    await Promise.all([
      dispatch(fetchQuestionsByIdsAction(answerQuestionIds)),
      dispatch(fetchAnswersByIdsAction(recentAnswersIds))])
    await Promise.all([
      dispatch(setAnswersAction(answers)),
      dispatch(setQuestionsAction(questions))])
    await dispatch(fetchMyPostApiActions(uid).actions.success)
    return userPosts
  } catch (error) {
    return null
  }
}

const parseSort = sort => (sort === 'mostanswered' ? 'popular' : sort)

export interface FetchUserPostParams {
  sort?: RecommendationSortNames;
  uid?: string;
  categoryId?: string
}

export const fetchUserPostsAction: (params: FetchUserPostParams) => ThunkedAction<State> =
({ sort = RecommendationSortNames.RECENT, uid, categoryId }) => async (dispatch, getState) => {
  const state = getState()
  const _sort = parseSort(sort)
  const myUid = (state.user && state.user.profile && state.user.profile.uid)
  const selectedUid = uid || myUid
  if (!selectedUid) {return}
  const params = {
    uid: selectedUid,
    sort: _sort,
    from: 0,
    limit: POST_PER_PAGE,
    communityId: categoryId,
  }
  try {
    let key = `${selectedUid}-${sort}`
    if (categoryId) {key = `${selectedUid}-${sort}-${categoryId}`}

    const userPosts = await fetchAndSetQuestionsAndAnswers(dispatch, selectedUid, params, state)
    await dispatch(setUserPostsAction({ filter: key, list: userPosts }))
  } catch (e) { /**/ }
}


export const fetchMoreUserPostAction: (params: FetchUserPostParams) => ThunkedAction<State> =
({ sort = RecommendationSortNames.RECENT, uid, categoryId }) => async (dispatch, getState) => {
  const state = getState()

  const myUid = (state.user && state.user.profile && state.user.profile.uid)
  const selectedUid = uid || myUid
  let key = `${selectedUid}-${sort}`
  if (categoryId) {key = `${selectedUid}-${sort}-${categoryId}`}
  if (!selectedUid) {return}
  const { skip = 0, canLoadMore = false } = state.listings.communityLists.userPostsList[key]
  const status = fetchUserPostApiStatusSelector(state, { uid: selectedUid })
  const _sort = parseSort(sort)
  if (status === RequestStatus.FETCHING || !canLoadMore) {return}
  const params = {
    uid: selectedUid,
    sort: _sort,
    from: skip,
    limit: POST_PER_PAGE,
    communityId: categoryId,
  }
  try {
    const userPosts = await fetchAndSetQuestionsAndAnswers(dispatch, selectedUid, params, state)
    await dispatch(setMoreUserPostsAction({ filter: key, list: userPosts }))
  } catch (error) { /* */ }
}
