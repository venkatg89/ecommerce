import { State } from 'src/redux/reducers'
import { fetchQuestion } from 'src/endpoints/milq/communities/fetchQuestion'
import { normalizeQuestionResponseData } from 'src/helpers/api/milq/nomalizeQuestions'
import { setQuestionAction } from './recommendationAction'
import { RecommendationSortNames } from 'src/models/Communities/QuestionModel'

export const fetchQuestionAction: (filter:string, questionId: string) => ThunkedAction<State> =
  (filter, questionId) => async (dispatch, getState) => {
    // const state = getState()
    // No need to fetch the question if it has already been fetched
    // Only update the answer list later
    // if (state.communities.questions[questionId]) {
    //   return
    // }
    // TODO implement pagination
    const sort = RecommendationSortNames.RECENT
    const params = {
      from: 0,
      limit: 20,
      sort,
    }
    const response = await fetchQuestion(questionId, params)
    if (response.ok) {
      const question = normalizeQuestionResponseData(response.data)
      await dispatch(setQuestionAction({ questionId, question }))
    } else {
      // TODO signal error
    }
  }
