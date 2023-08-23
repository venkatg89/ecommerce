import { State } from 'src/redux/reducers'
import { Ean, asBookModelForMilq } from 'src/models/BookModel'
import { QuestionId } from 'src/models/Communities/QuestionModel'
import { postAnswer } from 'src/endpoints/milq/communities/postAnswer'
import { normalizePostAnswerData } from 'src/helpers/api/milq/normalizePostAnswerData'
import { setAnswersAction } from 'src/redux/actions/book/fetchAnswersForQuestionAction'
import { askForPushPermissionsIfWeHaveNotYet } from 'src/redux/actions/onboarding'
import { setAgreeAnswer } from 'src/redux/actions/user/community/agreeAnswersAction'

export const postAnswerAction:
  (questionId: QuestionId, EAN: Ean) => ThunkedAction<State, any> =
  (questionId, EAN) => async (dispatch, getState) => {
    const book = getState()._legacybooks.booksList[EAN]
    const postAnswerData = {
      questionId,
      title: book.name,
      product: asBookModelForMilq(book),
    }
    const response = await postAnswer(postAnswerData)
    if (response.data && response.data._id) {
      const answer = normalizePostAnswerData(response.data)
      await dispatch(setAnswersAction({ [answer.id]: answer }))
      if (response.data.convertedToAgree) {
        dispatch(setAgreeAnswer({ answerId: answer.id }))
      }
      // Ask for Push if we have not yet
      await dispatch(askForPushPermissionsIfWeHaveNotYet(true))
      return ({
        answerId: answer.id,
        ...(response.data.convertedToAgree && { _convertedToAgree: true }),
      })
    }
    return undefined
  }
