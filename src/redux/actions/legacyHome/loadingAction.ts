import makeActionCreator from 'src/helpers/redux/makeActionCreator'

export const SET_HOME_DISCOVERY_LOADING_ACTION = 'SET_HOME_DISCOVERY_LOADING_ACTION'
export const SET_HOME_SOCIAL_LOADING_ACTION = 'SET_HOME_SOCIAL_LOADING_ACTION'

export const homeDiscoveryLoadingAction = makeActionCreator<boolean>(SET_HOME_DISCOVERY_LOADING_ACTION)
export const homeSocialLoadingAction = makeActionCreator<boolean>(SET_HOME_SOCIAL_LOADING_ACTION)
