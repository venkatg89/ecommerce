import atgApiRequest from 'src/apis/atgGateway'

export const GET_SAVE_FOR_LATER_LIST = '/my-account/getSaveForLaterList'
export const GET_SAVE_FOR_LATER_LIST_ID = '/my-account/getSaveForLaterListId'
export const MOVE_SAVE_FOR_LATER_ITEM_TO_CART =
  '/cart-checkout/addSaveForLaterItemToCart'
export const REMOVE_SAVE_FOR_LATER_ITEM =
  '/cart-checkout/removeSavedForLaterItem'
export const ADD_ITEM_TO_SAVE_FOR_LATER = '/cart-checkout/moveItemsFromCart'

export const fetchSaveForLaterListId = (atgId) =>
  atgApiRequest({
    method: 'POST',
    endpoint: GET_SAVE_FOR_LATER_LIST_ID,
    data: {
      atgUserId: atgId,
    },
  })

export const fetchSaveForLaterList = () =>
  atgApiRequest({
    method: 'POST',
    endpoint: GET_SAVE_FOR_LATER_LIST,
  })

export const addItemToSaveForLaterList = ({ itemList, listId }) =>
  atgApiRequest({
    method: 'POST',
    endpoint: ADD_ITEM_TO_SAVE_FOR_LATER,
    data: {
      itemIds: itemList,
      quantity: 1,
      giftlistId: listId,
    },
  })

export const moveSaveForLaterItemToCart = ({
  itemIds,
  catalogRefIds,
  productId,
}) =>
  atgApiRequest({
    method: 'POST',
    endpoint: MOVE_SAVE_FOR_LATER_ITEM_TO_CART,
    data: {
      itemIds,
      catalogRefIds,
      productId,
    },
  })

export const removeSaveForLaterItem = ({ itemId }) =>
  atgApiRequest({
    method: 'POST',
    endpoint: REMOVE_SAVE_FOR_LATER_ITEM,
    data: {
      savedItemToBeRemoved: itemId,
    },
  })
