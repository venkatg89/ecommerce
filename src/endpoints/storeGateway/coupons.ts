import storeGatewayApiRequest from 'src/apis/storeGateway'

import { couponGraphqlModel } from 'src/models/StoreModel/CouponModel'
import { normalizeCoupon } from 'src/helpers/api/store/normalizeCoupon'
import Logger from 'src/helpers/logger'

export const NUMBER_EVENTS_REQUESTED = 10

const buildEventsQueryObject = ({ customerKey, skip }) => {
  const eventsObject = `
    customer(customerKey: "${customerKey}") {
      customerKey
      couponAllocation(first: ${NUMBER_EVENTS_REQUESTED}, after: "${/* this uses pagination by pages */Math.ceil(skip / NUMBER_EVENTS_REQUESTED)}") {
        ${couponGraphqlModel}
      }
    }
  `
  return `query { ${eventsObject} }`
}

interface GetCouponsParams {
  customerKey?: string; // we currently do not handle guest user coupons
  skip?: number;
}

export const storeGetCoupons = ({ customerKey = '', skip = 0 }: GetCouponsParams) => storeGatewayApiRequest({
  method: 'POST',
  endpoint: '/coupon/graphql',
  data: {
    query: buildEventsQueryObject({ customerKey, skip }),
  },
})

export const normalizeCouponsFromResponseData = (data: any) => {
  if (!data || !data.data || !data.data.customer ||
      !data.data.customer.couponAllocation || !data.data.customer.couponAllocation.edges) {
    Logger.getInstance().warn(`normalizeCouponsFromResponseData did not find the coupon data in reply ${JSON.stringify(data)}`)
    return { couponIds: [], coupons: [] }
  }

  const couponList = data.data.customer.couponAllocation.edges

  const couponIds = couponList.map(coupon => coupon.node.promoHeader.promoId)
  const coupons = couponList.reduce((object, coupon) => ({
    ...(object || {}),
    [coupon.node.promoHeader.promoId]: normalizeCoupon(coupon.node),
  }), {})

  return {
    couponIds,
    coupons,
  }
}
