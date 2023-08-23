import { State } from 'src/redux/reducers'
import { menuIdFromCurrentVenueSelector } from 'src/redux/selectors/cafeSelector'
import { favoriteStoreIdSelector } from 'src/redux/selectors/myBn/storeSelector'

export const itemOptionsListingsSelector = (state) =>
  state.listings.cafe.itemOptions

const EMPTY_ARRAY = []

export const currentCafeCategoryIdsSelector = (stateAny) => {
  const state = stateAny as State
  const menuId = menuIdFromCurrentVenueSelector(state)
  if (menuId) {
    return state.listings.cafe.categories[menuId] || EMPTY_ARRAY
  }
  return EMPTY_ARRAY
}

export const cafeItemIdsFromCategoryIdSelector = (stateAny, props) => {
  const state = stateAny as State
  const { categoryId } = props
  return state.listings.cafe.items[categoryId] || EMPTY_ARRAY
}

export const cafeSearchVenuesSelector = (stateAny) => {
  const state = stateAny as State
  return state.listings.cafe.venues
}

export const cafeSearchVenueResultListSelector = (stateAny) => {
  const state = stateAny as State
  const venueIds = cafeSearchVenuesSelector(state).ids
  const { venues } = state.cafe
  return venueIds.map((venueId) => venues[venueId]).filter((e) => !!e)
}

export const favoriteCafeVenueSelector = (stateAny) => {
  const state = stateAny as State
  const favoriteStoreId = favoriteStoreIdSelector(state)
  const { venues } = state.cafe
  return favoriteStoreId && Object.values(venues).find(venue => venue.storeId === favoriteStoreId) || undefined
}
