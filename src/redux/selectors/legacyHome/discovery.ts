import { State } from 'src/redux/reducers'

export const discoveryCardsSelector = (stateAny) => {
  const state = stateAny as State
  return state._legacyHome.discovery.cards
}
