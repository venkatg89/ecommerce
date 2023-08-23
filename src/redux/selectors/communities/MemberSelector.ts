import { State } from 'src/redux/reducers'

import { RequestStatus } from 'src/models/ApiStatus'

const EMPTY_ARRAY = []

export const membersForAnswerSelector = (stateAny, props) => {
  const state = stateAny as State
  const { answerId } = props
  const { requestStatus } = state.milq.api.fetchMembersForAnswer
  const commentList = state.communities.comments[answerId]
  const comments = (commentList && Object.values(state.communities.comments[answerId])) || null
  if (comments && requestStatus === RequestStatus.SUCCESS) {
    const uids = comments
      .filter(comment => comment.isAgreedNote)
      .map(comment => comment.creator.uid)
    const isValid = uids && uids.every(uid => state.users[uid])
    if (isValid) {
      return uids.map(uid => state.users[uid].profile)
    }
  }
  return EMPTY_ARRAY
}
