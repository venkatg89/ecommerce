import { State } from 'src/redux/reducers'

const EMPTY_OBJECT = {}

export const cafeItemsFromIdsSelector = (stateAny, props) => {
  const state = stateAny as State
  const { itemIds } = props
  return itemIds.map(id => state.cafe.items[id])
}

export const categoriesFromIdsSelector = (stateAny, props) => {
  const state = stateAny as State
  const { categoryIds } = props
  return categoryIds.map(id => state.cafe.categories[id])
}

export const categorySelector = (stateAny, props) => {
  const state = stateAny as State
  const { categoryId } = props
  const { categories } = state.cafe
  return categories[categoryId] || EMPTY_OBJECT
}

export const cafeItemSelector = (stateAny, props) => {
  const state = stateAny as State
  const { itemId } = props
  return state.cafe.items[itemId] || EMPTY_OBJECT
}

export const cafeCategorySelector = (stateAny, props) => {
  const state = stateAny as State
  const { categoryId } = props
  return state.cafe.categories[categoryId]
}

export const addonGroupIdsFromItemIdSelector = (stateAny, props) => {
  const state = stateAny as State
  const { itemId } = props
  const item = cafeItemSelector(state, { itemId })
  return item.addonGroups.map(addonGroup => addonGroup.id)
}

export const cafeItemOptionsSelector = (stateAny) => {
  const state = stateAny as State
  return state.cafe.itemOptions
}

export const checkedInVenueIdSelector = (stateAny) => {
  const state = stateAny as State
  return (state.cafe.checkedInVenue || undefined)
}

export const venueFromIdSelector = (stateAny, props) => {
  const state = stateAny as State
  const { venueId } = props
  return state.cafe.venues[venueId]
}

export const venuesSelector = (stateAny) => {
  const state = stateAny as State
  return state.cafe.venues
}

export const checkedInVenueSelector = (stateAny) => {
  const state = stateAny as State
  const venueId = checkedInVenueIdSelector(state)
  return venueId ? state.cafe.venues[venueId] : undefined
}

export const menuIdFromCurrentVenueSelector = (stateAny) => {
  const state = stateAny as State
  const currentVenueId = state.cafe.checkedInVenue
  if (currentVenueId) {
    const venue = state.cafe.venues[currentVenueId]
    if (venue) {
      return venue.menuId
    }
  }
  return undefined
}

export const cafeCartSelector = (stateAny) => {
  const state = stateAny as State
  return state.cafe.cart
}

export const paymentCardListSelector = (stateAny) => {
  const state = stateAny as State
  const { cards } = state.cafe.payment
  return Object.keys(cards).map(cardId => cards[cardId])
}

export const getSelectedPaymentCardSelector = (stateAny) => {
  const state = stateAny as State
  const { cards } = state.cafe.payment
  const cardId = state.widgets.selectedPaymentCardId
  if (cardId) {
    return cards[cardId]
  }
  return undefined
}

export const getSelectedSelectedPaymentUuidSelector = (state) => {
  const card = getSelectedPaymentCardSelector(state)
  return card && card.id
}

export const recentOrdersSelector = (stateAny) => {
  const state = stateAny as State
  return state.cafe.recentOrders
}

export const currentOrdersSelector = (stateAny) => {
  const state = stateAny as State
  return state.cafe.currentOrders
}
