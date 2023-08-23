import { State } from 'src/redux/reducers'

import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import {
  makeApiActions,
  makeApiActionsWithIdPayloadMaker,
} from 'src/helpers/redux/makeApiActions'
import { AddOrderToCart } from 'src/models/CafeModel/CartModel'
import { CafeRecentOrder } from 'src/models/CafeModel/OrderModel'
import { RequestStatus } from 'src/models/ApiStatus'
import cafeOrderHashKey from 'src/helpers/api/cafe/cafeOrderHashKey'
import { SpeedetabSession } from 'src/apis/session/sessions'

import {
  getCart,
  addOrderToCart,
  removeOrderFromCart,
  normalizeGetCartResponseData,
} from 'src/endpoints/speedetab/cart'
import { submitOrder } from 'src/endpoints/nodeJs/cafe'

import { CAFE_ERROR_MODAL } from 'src/constants/formErrors'
import { GlobalModals } from 'src/constants/globalModals'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import { fetchCurrentOrdersAction } from 'src/redux/actions/cafe/orderAction'
import { getSelectedSelectedPaymentUuidSelector } from 'src/redux/selectors/cafeSelector'
import { cartOrderSummaryApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/cafe'
import { atgUserIdSelector } from 'src/redux/selectors/userSelector'
import Logger from 'src/helpers/logger'

export const cafeCartOrderSummaryApiStatusActions = makeApiActions(
  'cafeCartOrderSummary',
  'CAFE__CART_ORDER_SUMMARY',
)

export const submitCafeOrderApiStatusActions = makeApiActions(
  'cafeOrderSubmit',
  'CAFE__ORDER_SUBMIT',
)

export const addOrderToCartApiStatusActions = makeApiActionsWithIdPayloadMaker(
  'cafeAddOrderToCart',
  'CAFE__ORDER_ADD_TO_CART',
)

export const CLEAR_CAFE_CART = 'CAFE__CART_CLEAR'
const clearCart = makeActionCreator(CLEAR_CAFE_CART)

export const submitCafeOrderAction: () => ThunkedAction<
  State,
  boolean
> = () => async (dispatch, getState) => {
  await dispatch(submitCafeOrderApiStatusActions.actions.inProgress)

  const paymentToken = getSelectedSelectedPaymentUuidSelector(getState())
  if (!paymentToken) {
    Logger.getInstance().error(
      `submitCafeOrderAction - paymentToken was ${paymentToken}`,
    ) // null or undefined
    return false
  }

  const sessionToken = await SpeedetabSession.get()
  if (!sessionToken) {
    Logger.getInstance().error(
      `submitCafeOrderAction - sessionToken was ${sessionToken}`,
    ) // null or undefined
    return false
  }

  const atgUid = atgUserIdSelector(getState())

  const response = await submitOrder({ paymentToken, sessionToken, atgUid })
  if (response.ok) {
    await dispatch(fetchCurrentOrdersAction())
    dispatch(clearCart())
    await dispatch(submitCafeOrderApiStatusActions.actions.success)
    return response.data.orderId
  } else {
    const error = response.error
    if (error?.errorCode === 'CAFE_DISABLED') {
      dispatch(setActiveGlobalModalAction({ id: GlobalModals.RELOG_ACCOUNT }))
    } else {
      await dispatch(
        setformErrorMessagesAction(CAFE_ERROR_MODAL, [
          { formFieldId: 'body', error: error.message },
        ]),
      )
      dispatch(setActiveGlobalModalAction({ id: GlobalModals.CAFE_ERROR }))
    }
  }
  await dispatch(submitCafeOrderApiStatusActions.actions.failed)
  return false
}

export const SET_CAFE_CART = 'CAFE__CART_SET'
const setCart = makeActionCreator(SET_CAFE_CART)

export const updateCartAction: (
  forceUpdate?: boolean,
) => ThunkedAction<State> = (forceUpdate) => async (dispatch, getState) => {
  if (
    !forceUpdate &&
    cartOrderSummaryApiRequestStatusSelector(getState()) ===
      RequestStatus.FETCHING
  ) {
    return
  }
  await dispatch(cafeCartOrderSummaryApiStatusActions.actions.inProgress)
  const response = await getCart()
  if (response.ok) {
    const cart = normalizeGetCartResponseData(response.data)
    await dispatch(setCart({ cart }))
  }
  await dispatch(cafeCartOrderSummaryApiStatusActions.actions.success)
}

export const fetchCartAction: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  if (
    cartOrderSummaryApiRequestStatusSelector(getState()) ===
    RequestStatus.FETCHING
  ) {
    return
  }
  await dispatch(cafeCartOrderSummaryApiStatusActions.actions.inProgress)
  await dispatch(updateCartAction(true))
  await dispatch(cafeCartOrderSummaryApiStatusActions.actions.success)
}

const handleAddOrderError = (response) => {
  const data = response.data
  return (
    (data.errors.menu_item_id && data.errors.menu_item_id[0]) ||
    (data.errors['addons.menu_addon_id'] &&
      data.errors['addons.menu_addon_id'][0]) ||
    'Error trying to add to cart'
  )
}

const addOrderHelper = (params: AddOrderToCart) => {
  const { itemId, selectedItemOptions = [], count = 1 } = params
  const order = {
    menu_item_id: itemId,
    count,
    addons_attributes: Object.values(selectedItemOptions).map((addon) => ({
      menu_addon_id: addon[0],
    })),
  }

  return addOrderToCart(order)
}

export const fetchAddOrderToCartAction: (
  params: AddOrderToCart,
) => ThunkedAction<State, boolean> = ({
  itemId,
  selectedItemOptions,
  count,
}) => async (dispatch, getState) => {
  const hash = cafeOrderHashKey({ itemId, selectedItemOptions })
  await Promise.all([
    dispatch(addOrderToCartApiStatusActions(hash).actions.inProgress),
    dispatch(cafeCartOrderSummaryApiStatusActions.actions.inProgress),
  ])

  const response = await addOrderHelper({ itemId, selectedItemOptions, count })

  if (!response.ok) {
    await dispatch(
      setformErrorMessagesAction(CAFE_ERROR_MODAL, [
        { formFieldId: 'body', error: handleAddOrderError(response) },
      ]),
    )
    dispatch(setActiveGlobalModalAction({ id: GlobalModals.CAFE_ERROR }))

    await Promise.all([
      dispatch(addOrderToCartApiStatusActions(hash).actions.failed),
      dispatch(cafeCartOrderSummaryApiStatusActions.actions.failed),
    ])
    return false
  } else {
    // eslint-disable-line
    await dispatch(fetchCartAction())
    await Promise.all([
      dispatch(addOrderToCartApiStatusActions(hash).actions.success),
      dispatch(cafeCartOrderSummaryApiStatusActions.actions.success),
    ])
    return true
  }
}

export const removeOrderFromCartAction: (
  orderId: string,
) => ThunkedAction<State> = (orderId) => async (dispatch, getState) => {
  const response = await removeOrderFromCart({ orderId })

  if (response.ok) {
    await dispatch(fetchCartAction())
  }
}

export const addRecentOrderToCartAction: (
  params: CafeRecentOrder,
) => ThunkedAction<State, boolean> = (params) => async (dispatch, getState) => {
  await Promise.all([
    dispatch(addOrderToCartApiStatusActions(params.id).actions.inProgress),
    dispatch(cafeCartOrderSummaryApiStatusActions.actions.inProgress),
  ])

  const { items } = params

  const addOrders: Promise<any>[] = []
  items.forEach((item) => {
    for (let index = 0; index < (item.count || 1); index++) {
      if (!item.outOfStock) {
        addOrders.push(
          addOrderHelper({
            itemId: item.itemId,
            selectedItemOptions: item.selectedItemOptions,
          }),
        )
      }
    }
  })

  const responses = await Promise.all(addOrders)
  const errors = responses.filter((response) => !response.ok)
  if (errors.length) {
    const message = handleAddOrderError(errors[0])
    await dispatch(
      setformErrorMessagesAction(CAFE_ERROR_MODAL, [
        { formFieldId: 'body', error: message },
      ]),
    )
    if (message === 'This item is out of stock.') {
      dispatch(
        setActiveGlobalModalAction({ id: GlobalModals.CAFE_ITEM_OUT_OF_STOCK }),
      )
    } else {
      dispatch(setActiveGlobalModalAction({ id: GlobalModals.CAFE_ERROR }))
    }

    await Promise.all([
      dispatch(addOrderToCartApiStatusActions(params.id).actions.failed),
      dispatch(cafeCartOrderSummaryApiStatusActions.actions.failed),
    ])
    return false
  } else {
    // eslint-disable-line
    await dispatch(fetchCartAction())
    await Promise.all([
      dispatch(addOrderToCartApiStatusActions(params.id).actions.success),
      dispatch(cafeCartOrderSummaryApiStatusActions.actions.success),
    ])
    return true
  }
}
