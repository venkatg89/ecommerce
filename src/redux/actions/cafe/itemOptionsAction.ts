import { State } from 'src/redux/reducers'

import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActionsWithIdPayloadMaker } from 'src/helpers/redux/makeApiActions'

import {
  getCafeItemOptions,
  normalizeCafeItemOptionsResponseData,
} from 'src/endpoints/speedetab/itemOptions'

import { menuIdFromCurrentVenueSelector, addonGroupIdsFromItemIdSelector } from 'src/redux/selectors/cafeSelector'
import Logger from 'src/helpers/logger'

export const SET_CAFE_ITEM_OPTIONS = 'CAFE__ITEM_OPTIONS_SET'
const setCafeItemOptions = makeActionCreator(SET_CAFE_ITEM_OPTIONS)

export const cafeItemOptionsApiStatusActions = makeApiActionsWithIdPayloadMaker('cafeItemOptions', 'CAFE__ITEM_OPTIONS')

export const fetchCafeItemOptionsAction: (itemId: string) => ThunkedAction<State> =
  itemId => async (dispatch, getState) => {
    const state = getState()
    const addonGroupIds = addonGroupIdsFromItemIdSelector(state, { itemId })
    const menuId = menuIdFromCurrentVenueSelector(state)
    if (!menuId) {
      Logger.getInstance().warn(`fetchCafeItemOptionsAction - menuId was ${menuId}`) // null or undefined
      return
    }

    await dispatch(cafeItemOptionsApiStatusActions(itemId).actions.inProgress)

    await Promise.all(
      addonGroupIds.map(async (addonGroupId) => {
        const response = await getCafeItemOptions({ menuId, addonGroupId })
        if (response.ok) {
          const data = normalizeCafeItemOptionsResponseData(response.data)
          await dispatch(setCafeItemOptions({ addonGroupId, ...data }))
        }
      }),
    )

    await dispatch(cafeItemOptionsApiStatusActions(itemId).actions.success)
  }
