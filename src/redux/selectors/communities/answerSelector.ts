import { AnswerModel } from 'src/models/Communities/AnswerModel'
import { State } from 'src/redux/reducers'

export const answersListSelector = (stateAny) => {
  const state = stateAny as State
  return state.communities.answers
}

export const filterAnswersByIdsSelector = (stateAny, props): AnswerModel[] => {
  const state = stateAny as State
  const { ids } = props
  const answers = answersListSelector(state)
  return ids.filter(o => !!o).map(id => answers[id])
}
