
import { combineReducers } from 'redux'

import categoryQuestionsList, { CategoryQuestionIdsState } from './CategoryQuestionsReducer'
import homeQuestionsList, { HomeQuestionsListState } from './HomeQuestionsReducer'
import userPostsList, { UserPostsListState } from './UserPostsReducer'

export interface CommunityListState {
  categoryQuestionsList: CategoryQuestionIdsState
  homeQuestionsList: HomeQuestionsListState
  userPostsList: UserPostsListState
}

export default combineReducers<CommunityListState>({
  categoryQuestionsList,
  homeQuestionsList,
  userPostsList,
})
