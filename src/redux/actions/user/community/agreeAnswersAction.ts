import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import {
  milqGetAgreedAnswers,
  milqAgreeToAnswer,
  milqUnagreeToAnswer,
} from 'src/endpoints/milq/user/agreeAnswers'

import {
  getMyProfileUidSelector,
  myAgreedAnswerIdsSelector,
} from 'src/redux/selectors/userSelector'

export const SET_AGREE_ANSWERS = 'ANSWER__AGREE_ANSWERS_SET'
export const setAgreeAnswers = makeActionCreator<{ answerIds: number[] }>(
  SET_AGREE_ANSWERS,
)

export const fetchAgreedAnswersAction: (
  userId?: string,
) => ThunkedAction<State> = (userId) => async (dispatch, getState) => {
  const state = getState()
  if (!state.milq.session.active) {
    return
  }

  if (userId) {
    // TODO: fetch other user's agree Answers
  } else {
    const myUid = getMyProfileUidSelector(getState())
    if (!myUid) {
      return
    } // not logged in
    const response = await milqGetAgreedAnswers(myUid)
    if (response.ok) {
      const answerIds = response.data
      await dispatch(setAgreeAnswers({ answerIds }))
    }
  }
}

export const SET_AGREE_ANSWER = 'ANSWER__AGREE_ANSWER_SET'
export const setAgreeAnswer = makeActionCreator<{ answerId: number }>(
  SET_AGREE_ANSWER,
)
export const UNSET_AGREE_ANSWER = 'ANSWER__AGREE_ANSWER_UNSET'
export const unsetAgreeAnswer = makeActionCreator<{ answerId: number }>(
  UNSET_AGREE_ANSWER,
)

export const toggleAgreeToAnswerAction: (
  answerId: number,
) => ThunkedAction<State> = (answerId) => async (dispatch, getState) => {
  const agreeAnswerIds = myAgreedAnswerIdsSelector(getState())
  const agree = agreeAnswerIds.includes(answerId)

  if (agree) {
    const response = await milqUnagreeToAnswer(answerId)
    if (response.ok) {
      await dispatch(unsetAgreeAnswer({ answerId }))
    }
  } else {
    const response = await milqAgreeToAnswer(answerId)
    if (response.ok) {
      await dispatch(setAgreeAnswer({ answerId }))
    }
  }
}
