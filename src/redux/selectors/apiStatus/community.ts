import { State } from 'src/redux/reducers'
import { RequestStatus } from 'src/models/ApiStatus'

export const communityHomeFeedApiStatusSelector = (stateAny) => {
  const state = stateAny as State
  return state.milq.api.communityHomeFeed ? state.milq.api.communityHomeFeed.requestStatus : null
}

export const communityCategoryFeedApiStatusSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const { id } = ownProps
  const apiCall = state.milq.api.communityCategoryFeed[id]
  return apiCall
    ? apiCall.requestStatus
    : null
}

export const questionAnswersFeedApiStatusSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const { id } = ownProps
  const apiCall = state.milq.api.questionAnswersFeed[id]
  return apiCall
    ? apiCall.requestStatus
    : null
}

export const recommendBookCommentsApiStatusSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const { id } = ownProps
  const apiCall = state.milq.api.recommendBookComments[id]
  return apiCall
    ? apiCall.requestStatus
    : null
}


export const fetchMembersForAnswerStatusSelector = (stateAny) => {
  const state = stateAny as State
  return state.milq.api.fetchMembersForAnswer ? state.milq.api.fetchMembersForAnswer.requestStatus : null
}

export const fetchUserPostApiStatusSelector = (stateAny, props) => {
  const state = stateAny as State
  const { uid } = props
  const myUid = (state.user && state.user.profile && state.user.profile.uid)
  const selectedUid = uid || myUid
  const apiCall = state.milq.api.fetchUserPostApiStatus[selectedUid]
  return apiCall ? apiCall.requestStatus : null
}

export const updateFavoriteCommunitiesInProgressSelector = (stateAny) => {
  const state = stateAny as State
  return state.milq.api.myFavoriteCommunities.requestStatus === RequestStatus.FETCHING
}
