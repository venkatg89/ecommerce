import { State } from 'src/redux/reducers'

import { myMilqProfileSelector, myInterestCommunities,
  milqProfileSelector, favoriteCategoriesForMilqUserId } from 'src/redux/selectors/userSelector'

const EMPTY_ARRAY = []

export const getMilqProfileSelector = (stateAny: any, props: any) => {
  const state = stateAny as State
  const { isLocal, milqId } = props
  if (isLocal) {
    return myMilqProfileSelector(state)
  }
  return milqProfileSelector(state, { milqId })
}


export const getInterestCommunitiesSelector = (stateAny:any, props:any) => {
  const state = stateAny as State
  const { isLocal, milqId } = props
  if (isLocal) {
    return myInterestCommunities(state)
  }
  return favoriteCategoriesForMilqUserId(state, { milqId })
}


export const getRecentCollectionsSelector = (stateAny: any, props: any) => EMPTY_ARRAY
