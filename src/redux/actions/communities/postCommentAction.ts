import { State } from 'src/redux/reducers'
import { postComment, editComment } from 'src/endpoints/milq/communities/postComment'
import { normalizeCommentResult } from 'src/helpers/api/milq/normalizeCommentResult'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import { askForPushPermissionsIfWeHaveNotYet } from 'src/redux/actions/onboarding'

import { AnswerId, CommentId } from 'src/models/Communities/AnswerModel'

export const SET_BOOKS_TO_ANSWER_ACTION = 'SET_BOOKS_TO_ANSWER_ACTION'
export const RESET_BOOKS_TO_ANSWER_ACTION = 'RESET_BOOKS_TO_ANSWER_ACTION'
export const ADD_COMMENT_ACTION = 'ADD_COMMENT_ACTION'
export const ADD_CHILD_COMMENT_ACTION = 'ADD_CHILD_COMMENT_ACTION'
export const EDIT_COMMENT_ACTION = 'EDIT_COMMENT_ACTION'
export const EDIT_CHILD_COMMENT_ACTION = 'EDIT_CHILD_COMMENT_ACTION'

export const setBooksToAnswerAction = makeActionCreator(SET_BOOKS_TO_ANSWER_ACTION)
export const resetBooksToAnswerAction = makeActionCreator(RESET_BOOKS_TO_ANSWER_ACTION)
export const addCommentAction = makeActionCreator(ADD_COMMENT_ACTION)
export const addChildCommentAction = makeActionCreator(ADD_CHILD_COMMENT_ACTION)
export const updateCommentAction = makeActionCreator(EDIT_COMMENT_ACTION)
export const updateChildCommentAction = makeActionCreator(EDIT_CHILD_COMMENT_ACTION)

export const postCommentApiActions =
  makeApiActions('postCommentApiActions', 'COMMUNITY_POST_COMMENT')

export const postCommentAction: (answerId: AnswerId, parentId: CommentId, rawText: string) => ThunkedAction<State> =
  (answerId, parentId, rawText) => async (dispatch, getState) => {
    if (!getState().milq.session.active) {
      // TODO redirect to login?
      return
    }
    const data = {
      answerId,
      parentId,
      rawText,
    }
    try {
      const response = await postComment(data)
      if (response.ok) {
        const comment = normalizeCommentResult(response.data)
        const commentId = comment.id
        const comments = { [commentId]: comment }
        if (parentId) {
          await dispatch(addChildCommentAction({ answerId, parentId, comment }))
        } else {
          await dispatch(addCommentAction({ answerId, comments }))
        }
        // Ask for Push if we have not yet
        await dispatch(askForPushPermissionsIfWeHaveNotYet(true))
      } else {
        // TODO signal error
      }
    } catch {
      // SIGNAL ERROR
    }
  }

export const editCommentAction: (commentId: CommentId, parentId: CommentId, rawText: string) => ThunkedAction<State>
    = (commentId, parentId, rawText) => async (dispatch, getState) => {
      const state = getState()
      if (!state.milq.session.active) {
        return
      }
      const data = {
        rawText,
      }
      try {
        const response = await editComment(commentId, data)
        if (response.ok) {
          const comment = normalizeCommentResult(response.data)
          const { answerId, id, text } = comment
          if (parentId) {
            await dispatch(updateChildCommentAction({ answerId, parentId, commentId: id, text }))
          } else {
            await dispatch(updateCommentAction({ answerId, commentId: id, text }))
          }
        }
      } catch {
        /** */
      }
    }
