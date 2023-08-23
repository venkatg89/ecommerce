import { State } from 'src/redux/reducers'

import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import actionApiCall from 'src/helpers/redux/actionApiCall'

import {
  getCafeItems,
  normalizeCafeItemsResponseData,
} from 'src/endpoints/speedetab/items'

import { menuIdFromCurrentVenueSelector } from 'src/redux/selectors/cafeSelector'
import Logger from 'src/helpers/logger'

export const SET_CAFE_ITEMS = 'CAFE__ITEMS_SET'
const setCafeItems = makeActionCreator(SET_CAFE_ITEMS)

export const cafeItemsApiStatusActions = makeApiActionsWithIdPayloadMaker('cafeItems', 'CAFE__ITEMS')

export const fetchCafeItemsAction: (categoryId: string) => ThunkedAction<State> =
  categoryId => async (dispatch, getState) => {
    const menuId = menuIdFromCurrentVenueSelector(getState())
    if (!menuId) {
      Logger.getInstance().warn(`fetchCafeItemsAction - menuId was ${menuId}`) // null or undefined
      return
    }

    const response = await actionApiCall(
      dispatch, cafeItemsApiStatusActions(categoryId), () => getCafeItems({ menuId, categoryId }),
    )

    if (response.ok) {
      const data = normalizeCafeItemsResponseData(response.data)
      await dispatch(setCafeItems({ categoryId, ...data }))
    }
  }
