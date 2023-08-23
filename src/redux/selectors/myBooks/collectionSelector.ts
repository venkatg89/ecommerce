import { State } from 'src/redux/reducers'
import { RequestStatus } from 'src/models/ApiStatus'

const EMPTY_ARRAY = []
const EMPTY_OBJECT = {}

export const myCollectionsSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.nodeJs.collections.localUser
    .map(id => state.nodeJs.collections.list[id])
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .filter(e => !!e)
}

export const collectionSelector = (stateAny: any, props: any) => {
  const state = stateAny as State
  const id = props.collectionId
  return state.nodeJs.collections.list[id] || EMPTY_OBJECT
}

export const collectionBookEanSelector = (state: any, props: any) => {
  const collection = collectionSelector(state, props)
  return Object.keys(collection && collection.books || {})
}

export const collectionBookListSelector = (stateAny: any, props: any) => {
  const state = stateAny as State
  const collection = collectionSelector(state, props)
  if (collection) {
    return Object.keys(collection.books || {}).map(ean => ({
      ean,
      addedDate: collection.books[ean].added,
    }))
  }
  return EMPTY_ARRAY
}

export const myCollectionsForBookSelector = (stateAny: any, props: any) => {
  const state = stateAny as State
  const { ean } = props
  const myCollections = myCollectionsSelector(state)
  return myCollections.filter(col => !!col.books[ean])
}

export const isMyCollectionSelector = (stateAny, ownProps) => {
  const state = stateAny as State
  const myCollections = myCollectionsSelector(state)
  const { collectionId } = ownProps
  return myCollections.map(collection => collection.id).includes(collectionId) || undefined
}

export const myCollectionIdsForBookSelector = (stateAny: any, props: any) => {
  const state = stateAny as State
  const result = myCollectionsForBookSelector(state, props).map(e => e.id)
  return result
}

export const collectionsForMilqUserIdSelector = (stateAny: any, props: any) => {
  const state = stateAny as State
  const { milqUserId } = props
  const milqUserCollectionIds = state.nodeJs.collections.byMilqUserId[milqUserId]
  if (!milqUserCollectionIds) {
    return EMPTY_ARRAY
  }
  return milqUserCollectionIds.map(id => state.nodeJs.collections.list[id]).filter(e => !!e)
}

export const isBusyMyCollectionsSelector = (stateAny: any) => {
  const state = stateAny as State
  // Affected by profile (Reading Status), and all local collections
  return state.nodeJs.api.myCollections.requestStatus === RequestStatus.FETCHING
}


export const isBusySingleBookListMembershipSelector = (stateAny: any): boolean => {
  const state = stateAny as State
  // Affected by profile (Reading Status), and all local collections
  return state.nodeJs.api.myProfile.requestStatus === RequestStatus.FETCHING ||
    state.nodeJs.api.myCollections.requestStatus === RequestStatus.FETCHING
}

/**
 * Creates a list with EANs from all user collections
 * @param {Object} state
 * @returns {Array}
 */
export const myCollectionsEansSelector = (state: State) => {
  let eans: any = []
  myCollectionsSelector(state).map((collection) => {
    const collectionEans = Object.keys(collection.books || {}) || []
    eans = [
      ...eans,
      ...collectionEans,
    ]

    return collection
  })

  eans = Array.from(new Set(eans))

  return eans
}


export const getAllCollectionsSelector = (stateAny: any, props) => ([])

export const getNumberOfCollectionsBookAddedToSelector = (_state, ownProps) => 0

export const isBookAddedToAnyListSelector = (stateAny: any, ownProps: any) => false
