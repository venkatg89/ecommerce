import makeActionCreator from 'src/helpers/redux/makeActionCreator'

export const RESET_QUESTION_IDS_ACTION = 'RESET_QUESTION_IDS_ACTION'
export const ADD_ELEMENTS_TO_MYPOST = 'ADD_ELEMENTS_TO_MYPOST'
export const SET_QUESTIONS_ACTION = 'SET_QUESTIONS_ACTION'
export const SET_QUESTION_ACTION = 'SET_QUESTION_ACTION'
export const RESET_MYPOST = 'RESET_MYPOST'

export const resetQuestionIdsAction = makeActionCreator(RESET_QUESTION_IDS_ACTION)
export const addElementsToMyPost = makeActionCreator(ADD_ELEMENTS_TO_MYPOST)
export const setQuestionsAction = makeActionCreator(SET_QUESTIONS_ACTION)
export const setQuestionAction = makeActionCreator(SET_QUESTION_ACTION)
export const resetMyPost = makeActionCreator(RESET_MYPOST)
