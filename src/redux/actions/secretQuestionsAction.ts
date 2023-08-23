import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import {
  atgSecretQuestions,
  normalizeAtgSecretQuestionsResponse,
} from 'src/endpoints/atgGateway/secretQuestions'
import { State } from 'src/redux/reducers'

export const USER_SECRET_QUESTIONS_SET = 'USER__SECRET_QUESTIONS_SET'
const atgSecretQuestionsSetAction = makeActionCreator<string[]>(USER_SECRET_QUESTIONS_SET)

export const secretQuestionsFetchAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    try {
      const response = await atgSecretQuestions()

      if (response.ok) {
        await dispatch(atgSecretQuestionsSetAction(normalizeAtgSecretQuestionsResponse(response.data)))
      }
    } catch (e) { /**/ }
  }
