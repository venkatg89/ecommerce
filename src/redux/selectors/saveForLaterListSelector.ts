import { State } from 'src/redux/reducers'

export const saveForLaterListSelector = (state: State) => {
  return state.saveForLaterList
}