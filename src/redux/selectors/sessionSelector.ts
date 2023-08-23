import { State } from 'src/redux/reducers'

export const atgSessionSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.atg.session
}
