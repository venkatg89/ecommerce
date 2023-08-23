
import { combineReducers } from 'redux'
import { State } from '../index'
import booksList, { BooksListState } from './BookListReducer'
import bookToCategory, { BookToCategoryState } from './BookToCategoryReducer'
import bookToAnswer, { BookToAnswerState } from './BookToAnswerReducer'
import bookToQuestionSearchResults, { BookToQuestionSearchResults } from './BookToQuestionSearchReducer'
import booksByInterest, { BooksByInterestState } from './BookByInterestReducer'
import booksByContent, { BooksByContentState } from './BookByContentReducer'
import featuredRecommendations, { FeaturedRecommendationsState } from './FeaturedRecommendationsReducer'
import bookRecommendations, { BookRecommendationsState } from './BookRecommendationsReducer'

export interface BooksState {
  booksList: BooksListState,
  bookToAnswer: BookToAnswerState,
  bookToCategory: BookToCategoryState,
  bookToQuestionSearchResults: BookToQuestionSearchResults,
  booksByInterest: BooksByInterestState,
  booksByContent: BooksByContentState,
  featuredRecommendations: FeaturedRecommendationsState,
  bookRecommendations: BookRecommendationsState,
}

export default combineReducers<State>({
  booksList,
  bookToAnswer,
  bookToCategory,
  bookToQuestionSearchResults,
  booksByInterest,
  booksByContent,
  featuredRecommendations,
  bookRecommendations,
})
