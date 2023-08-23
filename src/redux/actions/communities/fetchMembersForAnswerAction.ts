import { State } from 'src/redux/reducers'

import { fetchMemberAction } from './fetchMemberAction'
import { fetchCommentAction } from './fetchCommentAction'
import { AnswerId } from 'src/models/Communities/AnswerModel'
import { makeApiActions } from 'src/helpers/redux/makeApiActions'

export const fetchMemberForAnswerActions =
  makeApiActions('fetchMemberForAnswerAction', 'COMMUNITY_ANSWER_FOR_MEMBER')

export const fetchMemberForAnswerAction: (answerId: AnswerId) => ThunkedAction<State> =
  answerId => async (dispatch, getState) => {
    await dispatch(fetchCommentAction(answerId))
    const comments = getState().communities.comments[answerId]
    const uids = Object.values(comments)
      .filter(comment => comment.isAgreedNote)
      .map(comment => comment.creator.uid)
    await dispatch(fetchMemberForAnswerActions.actions.inProgress)
    await Promise.all(
      uids.map(uid => dispatch(fetchMemberAction(uid))),
    )
    await dispatch(fetchMemberForAnswerActions.actions.success)
  }
