import atgApiRequest from 'src/apis/atgGateway'

const GET_ORDER_HISTORY = '/order-details/getOrderHistory'

import {
  OrderDetailsItemGroup,
  OrderHistoryModel,
} from 'src/models/UserModel/AtgAccountModel'

export const getOrderHistory = (uid, orderNumber = '') =>
  atgApiRequest({
    method: 'POST',
    endpoint: GET_ORDER_HISTORY,
    params: {
      profileId: uid,
      orderId: orderNumber,
    },
  })

export const normalizeOrderHistory = (orderHistory: OrderHistoryModel) => ({
  orderTotal: orderHistory.orderTotal,
  orderDate: orderHistory.orderDate,
  nookOrder: orderHistory.nookOrder,
  orderNumber: orderHistory.orderNumber,
  orderStatus: orderHistory.orderStatus,
})

export const normalizeOrderHistoryData = (
  orderHistory: OrderHistoryModel[],
) => {
  return orderHistory.map((orderHistory) => normalizeOrderHistory(orderHistory))
}

const normalizeItem = (item) => {
  if (item.BNOrderLineItem && item.BNOrderLineItem?.length > 0) {
    return item.BNOrderLineItem?.map((lineItem) => ({
      ean: lineItem.eanItemId,
      name: lineItem.SKUItem.displayName,
      deliveryDate: lineItem.promisedDeliveryDate,
      orderStatus: lineItem.lineStatus,
      quantity: lineItem.quantity,
      itemPrice: lineItem.itemPrice,
    }))
  }
  let items: OrderDetailsItemGroup[] = []
  item.BNOrderDO.forEach((group) => {
    items = [
      ...items,
      ...group.BNOrderLineItem?.map((lineItem) => ({
        ean: lineItem.eanItemId,
        name: lineItem.SKUItem.displayName,
        deliveryDate: lineItem.promisedDeliveryDate,
        orderStatus: lineItem.lineStatus,
        quantity: lineItem.quantity,
        itemPrice: lineItem.itemPrice,
      })),
    ]
  })
  return items
}

export const normalizeOrderDetails = (group, electronicItem) => {
  return {
    electronic: group.electronic || electronicItem,
    bopis: group.bopis || false,
    storeId: group.storeId,
    trackingNumber:
      group.trackingAvailable && group.showTracking && group.trackingNumber,
    items: normalizeItem(group),
  }
}

export const normalizeOrderDetailsData = (
  orderDetailsGroup,
  electronicItem = false,
) => {
  return orderDetailsGroup.map((group) =>
    normalizeOrderDetails(group, electronicItem),
  )
}
