import { combineReducers } from 'redux'

import { makeApiStatusReducerUsingApiAction,
  makeDictionaryApiStatusReducerUsingApiAction,
} from 'src/helpers/redux/makeApiStateReducer'
import { ApiStatus } from 'src/models/ApiStatus'

import { preferencesApiActions } from 'src/redux/actions/user/preferencesAction'
import {
  myFavoriteCommunitiesApiActions,
  followCommunityApiActions,
} from 'src/redux/actions/user/community/favoriteCategoriesAction'
import { fetchMemberForAnswerActions } from 'src/redux/actions/communities/fetchMembersForAnswerAction'
import { fetchMyPostApiActions } from 'src/redux/actions/communities/fetchUserPostAction'
import { searchResultsApiStatusActions } from 'src/redux/actions/legacySearch/searchResultsAction'
import { communityHomeFeedApiActions } from 'src/redux/actions/communities/fetchFeedhomeQuestionsAction'
import { communityCategoryFeedApiActions } from 'src/redux/actions/communities/fetchCategoryQuestionsAction'
import { questionAnswersFeedApiActions } from 'src/redux/actions/book/fetchAnswersForQuestionAction'
import { recommendBookCommentsApiActions } from 'src/redux/actions/communities/fetchCommentAction'
import { userFollowingListApiActions } from 'src/redux/actions/user/community/followingAction'
import { userFollowersListApiActions } from 'src/redux/actions/user/community/followersAction'
import { myNotificationsApiActions } from 'src/redux/actions/legacyHome/social/notificationsActions'
import { fetchMemberApiActions } from 'src/redux/actions/communities/fetchMemberAction'

export interface ApiState {
  preferences: ApiStatus
  myFavoriteCommunities: ApiStatus
  fetchMembersForAnswer: ApiStatus
  fetchUserPostApiStatus: Record<string, ApiStatus>
  search: Record<string, ApiStatus>
  communityHomeFeed: ApiStatus
  communityCategoryFeed: Record<string, ApiStatus>
  questionAnswersFeed: Record<string, ApiStatus>
  recommendBookComments: Record<string, ApiStatus>
  followCommunity: ApiStatus
  userFollowing: Record<string, ApiStatus>
  userFollowers: Record<string, ApiStatus>
  myNotifications: ApiStatus
  fetchMembers: ApiStatus
}

export default combineReducers({
  preferences: makeApiStatusReducerUsingApiAction(preferencesApiActions.types),
  myFavoriteCommunities: makeApiStatusReducerUsingApiAction(myFavoriteCommunitiesApiActions.types),
  fetchMembersForAnswer: makeApiStatusReducerUsingApiAction(fetchMemberForAnswerActions.types),
  fetchUserPostApiStatus: makeDictionaryApiStatusReducerUsingApiAction(fetchMyPostApiActions().types),
  search: makeDictionaryApiStatusReducerUsingApiAction(searchResultsApiStatusActions().types),
  communityHomeFeed: makeApiStatusReducerUsingApiAction(communityHomeFeedApiActions.types),
  communityCategoryFeed: makeDictionaryApiStatusReducerUsingApiAction(communityCategoryFeedApiActions().types),
  questionAnswersFeed: makeDictionaryApiStatusReducerUsingApiAction(questionAnswersFeedApiActions().types),
  recommendBookComments: makeDictionaryApiStatusReducerUsingApiAction(recommendBookCommentsApiActions().types),
  followCommunity: makeApiStatusReducerUsingApiAction(followCommunityApiActions.types),
  userFollowing: makeDictionaryApiStatusReducerUsingApiAction(userFollowingListApiActions().types),
  userFollowers: makeDictionaryApiStatusReducerUsingApiAction(userFollowersListApiActions().types),
  myNotifications: makeApiStatusReducerUsingApiAction(myNotificationsApiActions.types),
  fetchMembers: makeApiStatusReducerUsingApiAction(fetchMemberApiActions.types),
})
