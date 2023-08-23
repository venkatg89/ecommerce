import { combineReducers } from 'redux'

import interests, { InterestsState } from './InterestsReducer'
import questions, { QuestionsState } from './QuestionsReducer/QuestionsReducer'
import comments, { CommentsListState } from './CommentReducer/CommentsReducer'
import answers, { AnswersListState } from './AnswersReducer/AnswersReducer'

export interface CommunitiesState {
  interests: InterestsState,
  questions: QuestionsState,
  comments: CommentsListState,
  answers: AnswersListState,
}

export default combineReducers<CommunitiesState>({
  interests,
  questions,
  comments,
  answers,
})
