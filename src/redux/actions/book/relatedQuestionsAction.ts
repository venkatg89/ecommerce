import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { getBookRelatedQuestions } from 'src/endpoints/milq/book/relatedQuestions'
import { QuestionResponseData } from 'src/models/Communities/QuestionModel'
import { Ean } from 'src/models/BookModel'
import { normalizeQuestionsReponseData } from 'src/helpers/api/milq/nomalizeQuestions'
import { State } from 'src/redux/reducers'

export const SET_BOOK_RELATED_QUESTIONS = 'BOOK__RELATED_QUESTIONS_SET'

const setBookRelatedQuestions = makeActionCreator(SET_BOOK_RELATED_QUESTIONS)

interface FetchBookRelatedQuestionsActionParams {
  workId: string;
  ean: Ean;
}

export const fetchBookRelatedQuestionsAction: (params: FetchBookRelatedQuestionsActionParams) => ThunkedAction<State> = // eslint-disable-line
  ({ workId, ean }) => async (dispatch, getState) => {
    const response = await getBookRelatedQuestions({ workId })

    if (response.ok) {
      const { questions, questionIds } = normalizeQuestionsReponseData(response.data) as QuestionResponseData
      await dispatch(setBookRelatedQuestions({ ean, questionIds, questions }))
    }
  }
