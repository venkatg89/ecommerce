import { State } from 'src/redux/reducers'
import { fetchComment } from 'src/endpoints/milq/communities/fetchComment'
import { normalizeCommentsResult } from 'src/helpers/api/milq/normalizeCommentResult'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { AnswerId } from 'src/models/Communities/AnswerModel'
import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import actionApiCall from 'src/helpers/redux/actionApiCall'

export const SET_BOOKS_TO_ANSWER_ACTION = 'SET_BOOKS_TO_ANSWER_ACTION'
export const RESET_BOOKS_TO_ANSWER_ACTION = 'RESET_BOOKS_TO_ANSWER_ACTION'
export const SET_COMMENTS_ACTION = 'SET_COMMENTS_ACTION'

export const setBooksToAnswerAction = makeActionCreator(SET_BOOKS_TO_ANSWER_ACTION)
export const resetBooksToAnswerAction = makeActionCreator(RESET_BOOKS_TO_ANSWER_ACTION)
export const setCommentsAction = makeActionCreator(SET_COMMENTS_ACTION)

export const recommendBookCommentsApiActions =
  makeApiActionsWithIdPayloadMaker('fetchCommentApiActions', 'QUESTION__COMMENTS')

export const fetchCommentAction: (answerId: AnswerId) => ThunkedAction<State> =
  answerId => async (dispatch, getState) => {
    const params = {
      answer: answerId,
    }

    const response = await actionApiCall(
      dispatch, recommendBookCommentsApiActions(answerId.toString()), () => fetchComment(params),
    )
    if (response.ok) {
      const { comments, childrenNotes } = normalizeCommentsResult(response.data)
      Object.keys(childrenNotes).forEach((commentId) => {
        comments[commentId].childNotes = childrenNotes[commentId]
      })
      await dispatch(setCommentsAction({ answerId, comments }))
    } else {
      // TODO signal error
    }
  }
