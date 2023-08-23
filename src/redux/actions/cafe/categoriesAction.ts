import { State } from 'src/redux/reducers'

import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'
import actionApiCall from 'src/helpers/redux/actionApiCall'

import {
  getCafeCategories,
  normalizeCafeCategoriesResponseData,
} from 'src/endpoints/speedetab/categories'

import { menuIdFromCurrentVenueSelector } from 'src/redux/selectors/cafeSelector'
import Logger from 'src/helpers/logger'

export const SET_CAFE_CATEGORIES = 'CAFE__CATEGORIES_SET'
const setCafeCategories = makeActionCreator(SET_CAFE_CATEGORIES)

export const cafeCategoriesApiStatusActions = makeApiActionsWithIdPayloadMaker('cafeCategories', 'CAFE__CATEGORIES')

export const fetchCafeCategoriesAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const menuId = menuIdFromCurrentVenueSelector(getState())
    if (!menuId) {
      Logger.getInstance().warn(`fetchCafeCategoriesAction - menuId was ${menuId}`) // null or undefined
      return
    }

    const response = await actionApiCall(
      dispatch, cafeCategoriesApiStatusActions(menuId), () => getCafeCategories({ menuId }),
    )

    if (response.ok) {
      const data = normalizeCafeCategoriesResponseData(response.data)
      await dispatch(setCafeCategories({ menuId, ...data }))
    }
  }
