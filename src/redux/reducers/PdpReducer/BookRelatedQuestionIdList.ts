import { Reducer } from 'redux'

import { SET_BOOK_RELATED_QUESTIONS } from 'src/redux/actions/book/relatedQuestionsAction'
import { Ean } from 'src/models/BookModel'

export type BookRelatedQuestionIdListState = Record<Ean, string[]>

const DEFAULT: BookRelatedQuestionIdListState = {}

const bookRelatedQuestionIdList: Reducer<BookRelatedQuestionIdListState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_BOOK_RELATED_QUESTIONS: {
      const { ean, questionIds } = action.payload
      return {
        ...state,
        [ean]: questionIds,
      }
    }

    default:
      return state
  }
}

export default bookRelatedQuestionIdList
