import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { State } from 'src/redux/reducers'
import {
  atgUserIdSelector,
  accountEmailSelector,
} from 'src/redux/selectors/userSelector'
import {
  getOrderHistory,
  normalizeOrderHistoryData,
  normalizeOrderDetailsData,
} from 'src/endpoints/atgGateway/getOrderHistory'

import { getSubmittedOrder } from 'src/endpoints/atgGateway/cart'
import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import {
  SearchOrderNumber,
  OrderDetailsModel,
} from 'src/models/UserModel/AtgAccountModel'
import { setformErrorMessagesAction } from '../form/errorsAction'
import { ShippingAddress } from 'src/models/ShopModel/CartModel'
import { OrderSummary } from 'src/screens/cart/OrderSubmitted/SubmittedOrderSummary'

export const SET_ORDER_DETAILS = 'SET_ORDER_DETAILS'
export const setOrderDetails = makeActionCreator(SET_ORDER_DETAILS)

const MAX_NUMBER = 100

export const getOrderDetailsAction: (
  orderHistoryList,
  email,
  maxNumber,
  errorFormId?: string,
) => ThunkedAction<State> = (
  orderHistoryList,
  email,
  maxNumber,
  errorFormId,
) => async (dispatch) => {
  for (
    let orderId = 0;
    orderId < maxNumber && orderId < orderHistoryList.length;
    orderId++
  ) {
    getSubmittedOrder(email, orderHistoryList[orderId]?.orderNumber).then(
      (response) => {
        if (response.ok) {
          const orderDetails = response.data?.response?.maOrderDetails
          const shippingGroups = orderDetails?.BNOrderShippingGroup
          const shippingGroupsResponse = normalizeOrderDetailsData(
            shippingGroups,
          )

          const payments = orderDetails.BNOrderPayments
          const paymentInfo = payments.length > 0 ? payments[0] : null

          let hasBopis = false
          let allEans: string[] = []

          shippingGroupsResponse.forEach((group) => {
            hasBopis = hasBopis || group.bopis
            group.items.forEach((item) => {
              allEans.push(item.ean)
            })
          })

          const summary: OrderSummary = {
            itemCount: allEans.length,
            subtotal: orderDetails.orderSubtotal,
            total: orderDetails.orderTotal,
            discountAmount: orderDetails.orderdiscount,
            shippingAmount: orderDetails.ordershippingCost,
            taxAmount: orderDetails.orderTax,
            giftWrapAmount: orderDetails.orderGiftWarpcharges,
            pickUpInStore: hasBopis,
          }
          const orderDetailsGroups: Record<string, OrderDetailsModel> = {
            [orderHistoryList[orderId].orderNumber]: {
              summary: summary,
              orderDate: orderDetails.orderSubmitteddate,
              orderNumber: orderHistoryList[orderId].orderNumber,
              shippingAddress: orderDetails?.shippingAddress as ShippingAddress,
              billingAddress: orderDetails?.billingAddress as ShippingAddress,
              cardType: paymentInfo?.cardType,
              cardLastDigits: paymentInfo?.cardNumber?.slice(-4),
              groups: [...shippingGroupsResponse],
              orderStatus: orderHistoryList[orderId].orderStatus,
            },
          }
          dispatch(setOrderDetails(orderDetailsGroups))
        } else if (errorFormId) {
          const message =
            response && response.data && response.data.response
              ? response.data.response.message
              : 'An error occured.'
          dispatch(
            setformErrorMessagesAction(errorFormId, [
              { formFieldId: errorFormId, error: message },
            ]),
          )
        }
      },
    )
  }
}

export const SET_ORDER_HISTORY = 'SET_ORDER_HISTORY'
export const setOrderHistory = makeActionCreator(SET_ORDER_HISTORY)

export const setOrderHistoryApiStatusActions = makeApiActions(
  'setOrderHistory',
  'SET_ORDER_HISTORY',
)

export const getOrderHistoryAction: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  const state = getState()
  const uid = atgUserIdSelector(state)
  const email = accountEmailSelector(state)
  await dispatch(setOrderHistoryApiStatusActions.actions.inProgress)
  const response = await getOrderHistory(uid)
  if (response.ok && response.data?.response?.orderHistoryList) {
    const orderHistoryList = normalizeOrderHistoryData(
      response.data.response.orderHistoryList,
    )
    await dispatch(setOrderHistory(orderHistoryList))
    await dispatch(setOrderHistoryApiStatusActions.actions.success)
    await dispatch(getOrderDetailsAction(orderHistoryList, email, MAX_NUMBER))
  } else {
    await dispatch(setOrderHistoryApiStatusActions.actions.failed)
  }
}

export const searchOrderHistoryAction: (
  orderNumber,
) => ThunkedAction<State, SearchOrderNumber | undefined> = (
  orderNumber,
) => async (dispatch, getState) => {
  const state = getState()
  const uid = atgUserIdSelector(state)
  const email = accountEmailSelector(state)
  let searchOrderNumber: SearchOrderNumber | undefined
  const response = await getOrderHistory(uid, orderNumber)

  if (response.ok && response.data?.response?.orderHistoryList) {
    const orderHistory = normalizeOrderHistoryData(
      response.data.response.orderHistoryList,
    )
    if (orderHistory.length === 0) {
      return searchOrderNumber
    }
    const responseOrderDetails = await getSubmittedOrder(
      email,
      orderHistory[0].orderNumber,
    )
    if (response.ok) {
      const orderDetails = responseOrderDetails.data?.response?.maOrderDetails
      const shippingGroups = orderDetails?.BNOrderShippingGroup
      const shippingGroupsResponse = normalizeOrderDetailsData(shippingGroups)

      let ebookGroupsResponse: OrderDetailsModel[] = []
      shippingGroups.map((item) => {
        ebookGroupsResponse = [
          ...ebookGroupsResponse,
          ...normalizeOrderDetailsData(item.BNOrderDO, true),
        ]
      })

      const allGroups = [...shippingGroupsResponse, ...ebookGroupsResponse]

      const payments = orderDetails.BNOrderPayments
      const paymentInfo = payments.length > 0 ? payments[0] : null

      let hasBopis = false
      let allEans: string[] = []

      allGroups.forEach((group) => {
        hasBopis = hasBopis || group.bopis
        group.items.forEach((item) => {
          allEans.push(item.ean)
        })
      })

      const summary: OrderSummary = {
        itemCount: allEans.length,
        subtotal: orderDetails.orderSubtotal,
        total: orderDetails.orderTotal,
        discountAmount: orderDetails.orderdiscount,
        shippingAmount: orderDetails.ordershippingCost,
        taxAmount: orderDetails.orderTax,
        giftWrapAmount: orderDetails.orderGiftWarpcharges,
        pickUpInStore: hasBopis,
      }

      searchOrderNumber = {
        orderDetails: {
          orderDate: orderHistory[0].orderDate,
          orderNumber: orderHistory[0].orderNumber,
          shippingAddress: orderDetails?.shippingAddress as ShippingAddress,
          billingAddress: orderDetails?.billingAddress as ShippingAddress,
          cardType: paymentInfo?.cardType,
          cardLastDigits: paymentInfo?.cardNumber?.slice(-4),
          summary: summary,
          groups: [...allGroups],
          orderStatus: orderHistory[0].orderStatus,
        },
        orderHistory: orderHistory[0],
      }
    }
  }
  return searchOrderNumber
}
