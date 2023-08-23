import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { SaveForLaterListModel } from 'src/models/SaveForLaterListModel'

import {
  fetchSaveForLaterList,
  addItemToSaveForLaterList,
  moveSaveForLaterItemToCart,
  removeSaveForLaterItem,
  fetchSaveForLaterListId,
} from 'src/endpoints/atgGateway/saveForLater'
import { refreshCartAction } from '../shop/cartAction'

export const SET_SAVE_FOR_LATER = 'SET_SAVE_FOR_LATER'
export const SET_SAVE_FOR_LATER_ID = 'SET_SAVE_FOR_LATER_ID'

export const setSaveForLaterList = makeActionCreator<
  Record<number, SaveForLaterListModel>
>(SET_SAVE_FOR_LATER)

export const normalizeSaveForLaterList = (
  response,
): Record<string, SaveForLaterListModel> => {
  if (response === null) return {}
  return response.reduce((obj, item) => {
    obj[item.id] = item
    return obj
  }, {})
}

export const getSaveForLaterListAction: () => ThunkedAction<State> = () => async (
  dispatch, getState,
) => {
  const state = getState()
  if (!state.user.account) { return }

  const response = await fetchSaveForLaterList()
  if (response.status === 200) {
    const saveForlaterListResponse = normalizeSaveForLaterList(
      response.data.response.saveForLaterList,
    )
    await dispatch(setSaveForLaterList(saveForlaterListResponse))
  }
}

export const addItemToSaveForLaterListAction: ({
  itemIds,
}) => ThunkedAction<State> = ({ itemIds }) => async (dispatch, getState) => {
  const state = getState()
  if (!state.user.account) {
    return
  }
  const listIdResponse = await fetchSaveForLaterListId(
    state.user.account?.atgUserId,
  )
  const listId = listIdResponse.data.wishlistItems?.listId
  let itemList = ''
  for (let index = 0; index < itemIds.length; index++) {
    itemList =
      itemList +
      (index === itemIds.length - 1 ? itemIds[index] : `${itemIds[index]},`)
  }
  const response = await addItemToSaveForLaterList({
    itemList,
    listId: listId || '',
  })
  if (response.status === 200) {
    await getSaveForLaterListAction()(dispatch, getState)
    await refreshCartAction()(dispatch, getState)
  }
}

export const moveSaveForLaterItemToCartAction: ({
  itemIds,
  catalogRefIds,
  productId,
}) => ThunkedAction<State, boolean> = ({
  itemIds,
  catalogRefIds,
  productId,
}) => async (dispatch, getState) => {
  const response = await moveSaveForLaterItemToCart({
    itemIds,
    catalogRefIds,
    productId,
  })
  if (response.status === 200) {
    await getSaveForLaterListAction()(dispatch, getState)
    await refreshCartAction()(dispatch, getState)
    return true
  }
  return false
}

export const removeSaveForLaterItemAction: ({
  itemId,
}) => ThunkedAction<State> = ({ itemId }) => async (dispatch, getState) => {
  const response = await removeSaveForLaterItem({ itemId })
  if (response.status === 200) {
    await getSaveForLaterListAction()(dispatch, getState)
  }
}
