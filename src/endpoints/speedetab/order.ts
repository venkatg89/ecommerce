import config from 'config'

import speedetabApiRequest from 'src/apis/speedetab'

import { CafeVenue } from 'src/models/CafeModel/VenueModel'
import { CafeRecentOrder } from 'src/models/CafeModel/OrderModel'
import { recentOrderNormalizer, currentOrderNormalizer } from 'src/helpers/api/cafe/orderNormalizer'
import { venueNormalizer } from 'src/helpers/api/cafe/venueNormalizer'

export const getCurrentOrders = () => speedetabApiRequest({
  method: 'GET',
  endpoint: '/users/v1/orders/current',
})

export const normalizeCurrentOrderResponseData = (data: any) => {
  const { orders = [] } = data

  const recentOrders = orders.map(order => currentOrderNormalizer(order))

  const venues: Record<string, CafeVenue> = orders.reduce((object, order) => {
    if (object[order.venue.id]) { return object }
    const venue = venueNormalizer(order.venue)
    return ({
      ...(object || {}),
      [order.venue.id]: venue,
    })
  }, {})

  return ({
    recentOrders,
    venues,
  })
}

interface GetRecentOrdersParam {
  venueId?: string;
}

export const getRecentOrders = ({ venueId }: GetRecentOrdersParam) => speedetabApiRequest({
  method: 'GET',
  endpoint: '/users/v1/orders',
  params: {
    merchant_id: config.api.speedetab.merchantId,
    venue_id: venueId,
  },
})

export const normalizeRecentOrderResponseData = (data: any) => {
  const { orders = [] } = data

  const _orders: Record<string, CafeRecentOrder> = orders.reduce((object, order) => {
    const _order = recentOrderNormalizer(order)
    return ({
      ...(object || {}),
      [order.id]: _order,
    })
  }, {})

  const venues: Record<string, CafeVenue> = orders.reduce((object, order) => {
    if (object[order.venue.id]) { return object }
    const venue = venueNormalizer(order.venue)
    return ({
      ...(object || {}),
      [order.venue.id]: venue,
    })
  }, {})

  const orderIds = orders.map(order => order.id)

  return ({
    orders: _orders,
    orderIds,
    venues,
  })
}
