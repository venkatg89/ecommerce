import atgApiRequest from 'src/apis/atgGateway'

import { WishListModel, WishtListItemModel } from 'src/models/WishListModel'

export const GET_WISH_LIST_DETAILS = '/wishList/getWishListDetails'
export const CREATE_WISH_LIST = '/wishList/createWishList'
export const REMOVE_ITEM_FROM_WISH_LIST = '/wishlist/removeItemFromWishlist'
export const ADD_ITEM_TO_WISH_LIST = '/wishlist/addItemToWishlist'
export const UPDATE_WISH_LIST = '/wishlist/updateWishlist'
export const DELETE_WISH_LIST = '/wishlist/deleteWishList'

interface FetchWishListsParams {
  uid: string
  id?: string
}

export const fetchWishLists = ({ uid, id }: FetchWishListsParams) => atgApiRequest({
  method: 'POST',
  endpoint: GET_WISH_LIST_DETAILS,
  data: {
    profileId: uid,
    wishListId: id,
  },
})

export const normalizeWishList = (wishList): WishListModel => {
  const items: WishtListItemModel[] = (wishList.items || []).map(item => ({
    addedDate: item.addedDate,
    priority: item.priority,
    name: item.name,
    quanity: item.quanity,
    ean: item.catalogRefId,
    id: item.itemId,
  }))

  return ({
    default: wishList.default,
    id: wishList.listId,
    name: wishList.name,
    type: wishList.type,
    isPublic: wishList.public,
    items,
  })
}

export const normalizeWishListsData = (wishLists): Record<string, WishListModel> => {
  return wishLists.map(wishList => normalizeWishList(wishList)).reduce((obj, wishList) => {
    obj[wishList.id] = wishList
    return obj
  }, {})
}

interface CreateWishListsParams {
  uid: string
  name: string
  isPublic?: boolean
}

export const createWishList = ({ uid, name, isPublic }: CreateWishListsParams) => atgApiRequest({
  method: 'POST',
  endpoint: CREATE_WISH_LIST,
  data: {
    profileId: uid,
    eventName: name,
    isPublic,
  },
})

export const removeItemFromWishList = ({ uid, id, itemId }) => atgApiRequest({
  method: 'POST',
  endpoint: REMOVE_ITEM_FROM_WISH_LIST,
  data: {
    profileId: uid,
    wishListId: id,
    giftItemId: itemId,
  },
})

export const addItemToWishList = ({ uid, id, ean }) => atgApiRequest({
  method: 'POST',
  endpoint: ADD_ITEM_TO_WISH_LIST,
  data: {
    profileId: uid,
    wishListId: id,
    ean,
  },
})

interface UpdateWishListsParams {
  uid: string
  id: string
  name: string
  isPublic?: boolean
}

export const updateWishList = ({ uid, id, name, isPublic }: UpdateWishListsParams) => atgApiRequest({
  method: 'POST',
  endpoint: UPDATE_WISH_LIST,
  data: {
    profileId: uid,
    giftlistId: id,
    eventName: name,
    isPublic,
  },
})

export const deleteWishList = ({ uid, id }) => atgApiRequest({
  method: 'POST',
  endpoint: DELETE_WISH_LIST,
  data: {
    profileId: uid,
    wishlistId: id,
  },
})
