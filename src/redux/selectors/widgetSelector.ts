import { State } from 'src/redux/reducers'

export const secretQuestionsSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.widgets.secretQuestions.map(question => ({ value: question }))
}

export const activeGlobalModalSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.widgets.activeGlobalModal || undefined
}

export const uiLoginInProgressSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.widgets.loginInProgress
}

export const allCountrySelector = (state: State) => {
  return state.shop.cart.countries
}

export const allStateSelector = (state: State) => {
  return state.shop.cart.states
}

export const cartItemCountSelector = (state) => {
  return state.widgets.cartItemCount
}
