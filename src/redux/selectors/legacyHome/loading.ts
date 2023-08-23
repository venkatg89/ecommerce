import { State } from 'src/redux/reducers'

export const homeDiscoveryLoadingSelector = (stateAny) => {
  const state = stateAny as State
  return state._legacyHome.loading.discoveryLoading
}

export const homeSocialLoadinSelector = (stateAny) => {
  const state = stateAny as State
  return state._legacyHome.loading.socialLoading
}
