import { State } from 'src/redux/reducers'
import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { createSelector } from 'reselect'

const EMPTY_ARRAY = []
const EMPTY_OBJECT = {}

export const questionsListFilterSelector = (stateAny) => {
  const state = stateAny as State
  const { questions } = state.communities
  const { homeQuestionsList } = state.listings.communityLists
  const { ids } = homeQuestionsList
  const listIds = (homeQuestionsList && ids) || EMPTY_ARRAY
  return listIds.map(questionId => questions[questionId])
}

export const questionsListCategorySelector = (stateAny, props) => {
  const state = stateAny as State
  const { categoryId, sort, filter } = props
  const { questions } = state.communities
  const { categoryQuestionsList } = state.listings.communityLists
  const key = `${filter}-${sort}-${categoryId}`
  const ids = (categoryQuestionsList && categoryQuestionsList[key] && categoryQuestionsList[key].ids) || EMPTY_ARRAY
  return ids.map(questionId => questions[questionId])
}

export const questionsListSelector = (stateAny) => {
  const state = stateAny as State
  return state.communities.questions
}

export const questionSelector = (stateAny, props) => {
  const state = stateAny as State
  const { questionId } = props
  const { questions } = state.communities
  return questions[questionId] as QuestionModel
}

export const recentAnswersSelector = () => createSelector(
  (state: State, ownProps) => state.communities.questions[ownProps.questionId].recentAnswerIds || EMPTY_ARRAY,
  (state: State) => state.communities.answers || EMPTY_OBJECT,
  (recentAnswerIds, answers) => recentAnswerIds.map(id => answers[id]).filter(o => !!o) || EMPTY_OBJECT,
)

export const questionFromAnswerSelector = (stateAny, props) => {
  const state = stateAny as State
  const { answerId } = props
  const answer = state.communities.answers[answerId]
  return state.communities.questions[answer.questionId]
}

export const communityFromAnswertSelector = (stateAny, props) => {
  const state = stateAny as State
  const { answerId } = props
  const answer = state.communities.answers[answerId]
  return state.communities.interests[answer.communityId]
}

export const communityFromQuestionSelector = (stateAny, props) => {
  const state = stateAny as State
  const { questionId } = props
  const question = state.communities.questions[questionId]
  return state.communities.interests[question.communityId]
}

export const questionTitleSelector = (stateAny, props) => {
  const state = stateAny as State
  const { answerId } = props
  const { questionId } = state.communities.answers[answerId]
  const question = state.communities.questions[questionId]
  return question ? question.title : ''
}

export const commentListSelector = (stateAny, props) => {
  const state = stateAny as State
  const { answerId } = props
  return state.communities.comments && state.communities.comments[answerId] || EMPTY_OBJECT
}

export const commentSelector = (stateAny, props) => {
  const state = stateAny as State
  const { answerId, commentId } = props
  return (state.communities.comments && state.communities.comments[answerId]
    && state.communities.comments[answerId][commentId]) || null
}

export const answerSelector = (stateAny, props) => {
  const state = stateAny as State
  const { answerId, answer } = props
  if (answer) {return answer}
  return state.communities.answers[answerId]
}

export const filterQuestionsByIdsSelector = (stateAny, props) => {
  const state = stateAny as State
  const { ids } = props
  const questions = questionsListSelector(state)
  return ids.filter(o => !!o).map(id => questions[id])
}
