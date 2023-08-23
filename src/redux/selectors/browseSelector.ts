import { State } from 'src/redux/reducers'

export const topNavDetailsSelector = (stateAny) => {
  const state = stateAny as State
  return state.browse.topNavDetails
}
