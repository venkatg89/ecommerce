import { cloneDeep } from 'lodash'
import {
  ShopCartItemModel,
  ShopCartModel,
} from 'src/models/ShopModel/CartModel'
import { ShopCartState } from '.'

// TODO: Is this adequate?
const MAX_CART_QUANTITY = 999999

export const modifyShopCartHelper = (state: ShopCartState, action) => {
  const newItems: [ShopCartItemModel] = cloneDeep(state.items)

  const itemToModify: ShopCartItemModel | undefined = newItems.find(
    (item) => item.id === action.payload.id,
  )
  if (!itemToModify) {
    return state
  }
  const previousQuantity = itemToModify?.quantity
  const newQuantity = Math.min(
    Math.max(0, previousQuantity + action.payload.modifier),
    MAX_CART_QUANTITY,
  )
  if (newQuantity === 0) {
    itemToModify.isSafeDeleted = true
  } else {
    itemToModify.quantity = newQuantity
  }

  return { ...state, items: [...newItems] }
}

export const refreshCartHelper = (state: ShopCartState, action) => {
  const newCart: ShopCartModel = cloneDeep(action.payload.cart)

  return newCart
}

export const safeRemoveItemHelper = (state: ShopCartState, action) => {
  const newItems: ShopCartItemModel[] = cloneDeep(state.items)

  const itemToModify = newItems.find((item) => item.id === action.payload.id)
  if (!itemToModify) {
    return state
  }

  itemToModify.isSafeDeleted = action.payload.remove

  return { ...state, items: [...newItems] }
}

export const setPickupStoreHelper = (state: ShopCartState, action) => {
  const items = cloneDeep(state.items)
  const { itemId, store } = action.payload
  items.forEach((element) => {
    if (element.id === itemId) {
      element.storePickUp = store.name
    }
  })
  const updates = {
    items,
  }
  return {
    ...state,
    ...updates,
  }
}

export const setShippingStatusHelper = (state: ShopCartState, action) => {
  const items = cloneDeep(state.items)
  const { itemId, status } = action.payload
  items.forEach((element) => {
    if (element.id === itemId) {
      element.shipItem = status
    }
  })
  const updates = {
    items,
  }
  return {
    ...state,
    ...updates,
  }
}
