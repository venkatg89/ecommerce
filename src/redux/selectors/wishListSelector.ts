import { State } from 'src/redux/reducers'

export const wishListSelector = (stateAny: any, props) => {
  const state = stateAny as State
  const { id } = props
  return state.wishLists[id] || {}
}

export const wishListIdsSelector = (stateAny: any) => {
  const state = stateAny as State
  return Object.keys(state.wishLists)
}

export const wishListsSelector = (stateAny: any) => {
  const state = stateAny as State
  return Object.values(state.wishLists)
}
