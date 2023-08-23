import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { deleteQuestion, deleteAnswer, deleteComment } from 'src/endpoints/milq/communities/deleteContent'

import { AnswerId } from 'src/models/Communities/AnswerModel'
import { QuestionId } from 'src/models/Communities/QuestionModel'
import { questionFromAnswerSelector } from 'src/redux/selectors/communities/questionsSelector'

export const DELETE_QUESTION_ACTION = 'DELETE_QUESTION_ACTION'
const deleteQuestionFromListAction = makeActionCreator<{ questionId: QuestionId }>(DELETE_QUESTION_ACTION)

export const DELETE_ANSWER_ACTION = 'DELETE_ANSWER_ACTION'
const deleteAnswerFromListAction = makeActionCreator<{ answerId: AnswerId, questionId: QuestionId }>(DELETE_ANSWER_ACTION)

export const DELETE_COMMENT_ACTION = 'DELETE_COMMENT_ACTION'
const deleteCommentFromListAction = makeActionCreator<{ commentId: number, answerId: AnswerId }>(DELETE_COMMENT_ACTION)
export const DELETE_CHILD_COMMENT_ACTION = 'DELETE_CHILD_COMMENT_ACTION'
const deleteChildCommentAction = makeActionCreator(DELETE_CHILD_COMMENT_ACTION)

export const deleteQuestionAction: (questionId: QuestionId) => ThunkedAction<State>
  = questionId => async (dispatch, getState) => {
    try {
      const response = await deleteQuestion(questionId)
      if (response.ok) {
        await dispatch(deleteQuestionFromListAction({ questionId }))
      }
    } catch { /** */ }
  }


export const deleteAnswerAction: (answerId: AnswerId) => ThunkedAction<State>
  = answerId => async (dispatch, getState) => {
    try {
      const response = await deleteAnswer(answerId)
      if (response.ok) {
        const question = questionFromAnswerSelector(getState(), { answerId })
        await dispatch(deleteAnswerFromListAction({ answerId, questionId: (question ? question.id : '') }))
      }
    } catch { /** */ }
  }


export const deleteCommentAction: (commentId: number, answerId: AnswerId, parentCommentId?: number) => ThunkedAction<State>
  = (commentId, answerId, parentCommentId) => async (dispatch, getState) => {
    try {
      const response = await deleteComment(commentId)
      if (response.ok) {
        if (parentCommentId) {
          await dispatch(deleteChildCommentAction({ commentId, answerId, parentCommentId }))
        } else {
          await dispatch(deleteCommentFromListAction({ commentId, answerId }))
        }
      }
    } catch { /** */ }
  }
