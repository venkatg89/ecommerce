import { CommunitiesInterestsList } from 'src/models/Communities/InterestModel'
import { State } from 'src/redux/reducers'

const EMPTY_OBJECT = {}

export const communitiesInterestsListSelector = (stateAny) => {
  const state = stateAny as State
  const { interests } = state.communities
  const categoryArray =
    Object.keys(interests).reduce((arr, key) => arr.concat(interests[key]), []) as CommunitiesInterestsList
  return categoryArray.sort((a, b) => ((a.name > b.name) ? 1 : -1))
}

export const communitiesInterestSelector = (stateAny, props) => {
  const state = stateAny as State
  const { categoryId } = props
  const { interests } = state.communities
  return interests[categoryId] || EMPTY_OBJECT
}

export const allCommunitiesInterestSelector = (stateAny) => {
  const state = stateAny as State
  return state.communities.interests
}
