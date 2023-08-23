import { State } from 'src/redux/reducers'

import { fetchQuestions } from 'src/endpoints/milq/communities/fetchQuestions'
import { setQuestionsAction } from 'src/redux/actions/communities/recommendationAction'

import { normalizeQuestionsReponseData } from 'src/helpers/api/milq/nomalizeQuestions'
import { QuestionId } from 'src/models/Communities/QuestionModel'


export const fetchQuestionsByIdsAction: (questionIds: QuestionId[]) => ThunkedAction<State> =
  questionIds => async (dispatch) => {
    const params = { ids: questionIds.join(',') }
    try {
      const response = await fetchQuestions(params)
      if (response.ok) {
        const { questions } = normalizeQuestionsReponseData(response.data)
        await dispatch(setQuestionsAction(questions))
      }
    } catch (error) { /* */ }
  }
