import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { WishListModel } from 'src/models/WishListModel'
import { State } from 'src/redux/reducers'

import {
  fetchWishLists, createWishList, removeItemFromWishList, normalizeWishListsData, addItemToWishList, updateWishList, deleteWishList,
} from 'src/endpoints/atgGateway/wishList'
import { atgUserIdSelector } from 'src/redux/selectors/userSelector'
import { wishListSelector } from 'src/redux/selectors/wishListSelector'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { CREATED_LIST_EXISTS } from 'src/constants/formErrors'

export const SET_WISH_LISTS = 'WISHLISTS__SET_WISH_LIST'
export const setWishLists = makeActionCreator<Record<string, WishListModel>>(SET_WISH_LISTS)

export const getWishListsAction: (id?: string) => ThunkedAction<State> = (id) => async (dispatch, getState) => {
  const state = getState()
  const uid = atgUserIdSelector(state)
  if (!uid) { return }
  const response = await fetchWishLists({ uid, id })
  if (response.ok) {
    const wishLists = normalizeWishListsData(response.data.response.wishLists)
    dispatch(setWishLists(wishLists))
  }
}

interface CreateParams {
  name: string
  isPublic?: boolean
}
export const createWishListAction: ({ name, isPublic }: CreateParams) => ThunkedAction<State, boolean> = ({ name, isPublic }) => async (dispatch, getState) => {
  const state = getState()
  const uid = atgUserIdSelector(state)
  const response = await createWishList({ uid, name, isPublic })
  if (response.ok) {
    const wishLists = normalizeWishListsData(response.data.response.userDetails.userInfo.wishLists)
    dispatch(setWishLists(wishLists))
    return true
  } else {
    dispatch(setformErrorMessagesAction(CREATED_LIST_EXISTS, [{ formFieldId: 'newListName', error: response.data.response.message }]))
  }
  return false
}

export const removeItemFromWishListAction: ({ id, ean, disableReload }) => ThunkedAction<State, boolean> = ({ id, ean, disableReload }) => async (dispatch, getState) => {
  const state = getState()
  const uid = atgUserIdSelector(state)
  // get itemId in wishList
  const wishList = wishListSelector(state, { id })
  const item = wishList.items.find(item => item.ean === ean)
  const itemId = item && item.id
  const response = await removeItemFromWishList({ uid, id, itemId })
  if (response.ok) {
    if (!disableReload) {
      // lets keep track of the initial list to keep track of deleted to undo
      const wishLists = normalizeWishListsData(response.data.response.userDetails.userInfo.wishLists)
      dispatch(setWishLists(wishLists))
    }
    return true
  }
  return false
}

export const addItemToWishListAction: ({ id, ean }) => ThunkedAction<State, boolean> = ({ id, ean }) => async (dispatch, getState) => {
  const state = getState()
  const uid = atgUserIdSelector(state)
  const response = await addItemToWishList({ uid, id, ean })
  if (response.ok) {
    const wishLists = normalizeWishListsData(response.data.response.userDetails.userInfo.wishLists)
    dispatch(setWishLists(wishLists))
    return true
  }
  return false
}

interface UpdateParams {
  id: string
  name: string
  isPublic?: boolean
}
export const updateWishListAction: ({ id, name, isPublic }: UpdateParams) => ThunkedAction<State, boolean> = ({ id, name, isPublic }) => async (dispatch, getState) => {
  const state = getState()
  const uid = atgUserIdSelector(state)
  const response = await updateWishList({ uid, id, name, isPublic })
  if (response.ok) {
    const wishLists = normalizeWishListsData(response.data.response.userDetails.userInfo.wishLists)
    dispatch(setWishLists(wishLists))
    return true
  }
  return false
}

export const deleteWishListAction: ({ id }) => ThunkedAction<State, boolean> = ({ id }) => async (dispatch, getState) => {
  const state = getState()
  const uid = atgUserIdSelector(state)
  const response = await deleteWishList({ uid, id })
  if (response.ok) {
    const wishLists = normalizeWishListsData(response.data.response.userDetails.userInfo.wishLists)
    dispatch(setWishLists(wishLists))
    return true
  }
  return false
}

interface RemoveEanFromWishListParams {
  id: string
  ean: string
}

export const REMOVE_EAN_FROM_WISHLIST = 'WISHLISTS__REMOVE_EAN'
const removeEanFromWishList = makeActionCreator<RemoveEanFromWishListParams>(REMOVE_EAN_FROM_WISHLIST)

export const removeEanFromWishListStateAction: (params: RemoveEanFromWishListParams) => ThunkedAction<State> = ({ id, ean }) => async (dispatch, getState) => {
  dispatch(removeEanFromWishList({ id, ean }))
}
