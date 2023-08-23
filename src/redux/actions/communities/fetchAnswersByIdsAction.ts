import { State } from 'src/redux/reducers'
import { AnswerId } from 'src/models/Communities/AnswerModel'
import { fetchAnswers } from 'src/endpoints/milq/communities/fetchAnswers'
import { normalizeAnswersData } from 'src/helpers/api/milq/nomalizeQuestions'
import { setAnswersAndBooksAction } from 'src/redux/actions/book/fetchAnswersForQuestionAction'
import { normalizeBook } from 'src/helpers/api/milq/normalizeBookResult'

export const fetchAnswersByIdsAction: (answerIds: AnswerId[]) => ThunkedAction<State> =
  answerIds => async (dispatch, getState) => {
    const params = { ids: answerIds.join(',') }
    try {
      const response = await fetchAnswers(params)
      if (response.ok) {
        const { answers } = normalizeAnswersData(response.data)
        const books = Object.values(answers).reduce((result, answer) => {
          const book = normalizeBook(answer.product)
          return { ...result, [book.ean]: book }
        }, {})
        await dispatch(setAnswersAndBooksAction({ answers, books }))
        // await Promise.all([dispatch(setBooksAction(books)), dispatch(setAnswersAction(answers))])
      }
    } catch { /** */ }
  }
