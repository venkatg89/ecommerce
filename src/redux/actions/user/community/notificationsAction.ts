import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import {
  getQuestionNotifications, stopQuestionNotifications,
  getAnswerNotifications, stopAnswerNotifications,
} from 'src/endpoints/milq/user/notifications'

import { myFollowedQuestionsIdsSelector, isFollowingAnswerSelector } from 'src/redux/selectors/userSelector'
import { State } from 'src/redux/reducers'
import { AnswerId } from 'src/models/Communities/AnswerModel'

/* fetch followed questions is part of relations action */

export const SET_FOLLOW_QUESTION = 'USER__QUESTION_NOTIFICATION_SET'
const followQuestion = makeActionCreator<{ questionId: string }>(SET_FOLLOW_QUESTION)
export const UNSET_FOLLOW_QUESTION = 'USER__QUESTION_NOTIFICATION_UNSET'
const unfollowQuestion = makeActionCreator<{ questionId: string }>(UNSET_FOLLOW_QUESTION)

export const SET_FOLLOW_ANSWER = 'USER__ANSWER_NOTIFICATION_SET'
const followAnswer = makeActionCreator<{answerId: AnswerId }>(SET_FOLLOW_ANSWER)
export const UNSET_FOLLOW_ANSWER = 'USER__ANSWER_NOTIFICATION_UNSET'
const unfollowAnswer = makeActionCreator<{answerId: AnswerId}>(UNSET_FOLLOW_ANSWER)

export const toggleQuestionNotificationsAction: (questionId: string) => ThunkedAction<State> =
  questionId => async (dispatch, getState) => {
    const followedQuestionsIds = myFollowedQuestionsIdsSelector(getState())
    const following = followedQuestionsIds.includes(questionId)

    if (following) {
      const response = await stopQuestionNotifications({ questionId })
      if (response.ok) {
        await dispatch(unfollowQuestion({ questionId }))
      }
    } else {
      const response = await getQuestionNotifications({ questionId })
      if (response.ok) {
        await dispatch(followQuestion({ questionId }))
      }
    }
  }


export const toggleAnswerNotificationAction: (answerId: AnswerId) => ThunkedAction<State>
  = answerId => async (dispatch, getState) => {
    const state = getState()
    const following = isFollowingAnswerSelector(state, { answerId })
    if (following) {
      const response = await stopAnswerNotifications({ answerId })
      if (response.ok) {
        await dispatch(unfollowAnswer({ answerId }))
      }
    } else {
      const response = await getAnswerNotifications({ answerId })
      if (response.ok) {
        await dispatch(followAnswer({ answerId }))
      }
    }
  }
