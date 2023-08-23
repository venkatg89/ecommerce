import { Reducer } from 'redux'

import { USER_SECRET_QUESTIONS_SET } from 'src/redux/actions/secretQuestionsAction'

export type SecretQuestionsState = string[]

// TODO - remove and change back to []
// This is a work-around for getSecretQuestions not working on ATG right now without a session
const DEFAULT: SecretQuestionsState = [
  'In what city were you born?',
  'What is the last name of your favorite author?',
  "What is your Mother's middle name?",
  "What is your Father's middle name?",
  'What is your favorite car?',
  "What is your pet's name?",
  'What is your favorite film?',
  'What is your favorite team?',
  'What was the name of your elementary school?',
  'What is your dream job?']

const secretQuestions: Reducer<SecretQuestionsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case USER_SECRET_QUESTIONS_SET: {
      const payload = action.payload as SecretQuestionsState
      return payload
    }

    default:
      return state
  }
}

export default secretQuestions
