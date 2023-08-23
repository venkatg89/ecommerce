import { combineReducers } from 'redux'

import agreedAnswers, { AgreedAnswersState } from './AgreedAnswersReducer'
import favoriteCategories, { FavoriteCategoriesState } from './FavoriteCategoriesReducer'
import questionNotifications, { FollowedQuestionsState } from './FollowedQuestionsReducer'
import followedUsers, { FollowedUsersState } from './FollowedUsersReducer'
import likedComments, { LikedCommentsState } from './LikedCommentsReducer'
import answerNotifications, { FollowedAnswerState } from './FollowedAnswerReducer'

export interface CommunityState {
  agreedAnswers: AgreedAnswersState;
  favoriteCategories: FavoriteCategoriesState;
  questionNotifications: FollowedQuestionsState;
  followedUsers: FollowedUsersState;
  likedComments: LikedCommentsState;
  answerNotifications: FollowedAnswerState
}

export default combineReducers<CommunityState>({
  agreedAnswers,
  favoriteCategories,
  questionNotifications,
  followedUsers,
  likedComments,
  answerNotifications,
})
