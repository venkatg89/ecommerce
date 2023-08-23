import { State } from 'src/redux/reducers'

export const userFollowingApiRequestStatusSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const { uid } = ownProps
  const apiCall = state.milq.api.userFollowing[uid]
  return apiCall
    ? apiCall.requestStatus
    : null
}

export const userFollowersApiRequestStatusSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const { uid } = ownProps
  const apiCall = state.milq.api.userFollowers[uid]
  return apiCall
    ? apiCall.requestStatus
    : null
}

export const atgAccountApiRequestStatusSelector = (stateAny) => {
  const state = stateAny as State
  return state.atg.api.account.requestStatus
}

export const nookLockerApiRequestStatusSelector = (stateAny) => {
  const state = stateAny as State
  return state.nodeJs.api.nookLocker.requestStatus
}

export const notInterestedApiSelector = (stateAny) => {
  const state = stateAny as State
  return state.nodeJs.api.notInterested
}

export const fetchMemberApiRequestSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.milq.api.fetchMembers.requestStatus
}
