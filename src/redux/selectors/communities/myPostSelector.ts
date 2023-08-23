import { State } from 'src/redux/reducers'

const EMPTY_ARRAY = []

export const userPostSelector = (stateAny, props) => {
  const state = stateAny as State
  const { uid, sort, categoryId } = props
  if (!state.user || !state.user.profile) {return EMPTY_ARRAY}
  const myUid = state.user.profile.uid
  const selectedUid = uid || myUid
  let key = `${selectedUid}-${sort}`
  if (categoryId) {key = `${selectedUid}-${sort}-${categoryId}`}
  const userPosts = state.listings.communityLists.userPostsList
  return userPosts[key] ? userPosts[key].ids : EMPTY_ARRAY
}
