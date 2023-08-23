import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { State } from 'src/redux/reducers'
import { validateSecurityAnswer } from 'src/endpoints/atgGateway/validateSecurityAnswer'

export const VALIDATE_SECURITY_ANSWER_FETCHING =
  'VALIDATE_SECURITY_ANSWER_FETCHING'
export const VALIDATE_SECURITY_ANSWER_SUCCESS =
  'VALIDATE_SECURITY_ANSWER_SUCCESS'
export const VALIDATE_SECURITY_ANSWER_FAILED = 'VALIDATE_SECURITY_ANSWER_FAILED'
export const UPDATE_ENCODED_USERID = 'UPDATE_ENCODED_USERID'

const validateSecurityAnswerFetchingAction = makeActionCreator(
  VALIDATE_SECURITY_ANSWER_FETCHING,
)
const validateSecurityAnswerSuccessAction = makeActionCreator(
  VALIDATE_SECURITY_ANSWER_SUCCESS,
)
const validateSecurityAnswerFailedAction = makeActionCreator(
  VALIDATE_SECURITY_ANSWER_FAILED,
)
const updateEncodedUserIdAction = makeActionCreator(UPDATE_ENCODED_USERID)

export const vaidateSecuritAnswerAction: (
  email: string,
  securityQuestion: string,
  securityAnswer: string,
) => ThunkedAction<State> = (email, securityQuestion, securityAnswer) => async (
  dispatch,
  getState,
) => {
  await dispatch(validateSecurityAnswerFetchingAction())
  const response = await validateSecurityAnswer(
    email,
    securityQuestion,
    securityAnswer,
  )

  if (response.ok) {
    await dispatch(validateSecurityAnswerSuccessAction())
    await dispatch(
      updateEncodedUserIdAction(response.data.response.encodedUserId),
    )
  } else {
    await dispatch(validateSecurityAnswerFailedAction())
  }
}

export default {
  VALIDATE_SECURITY_ANSWER_FETCHING,
  VALIDATE_SECURITY_ANSWER_SUCCESS,
  VALIDATE_SECURITY_ANSWER_FAILED,
}
