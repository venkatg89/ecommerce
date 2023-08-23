export const couponGraphqlModel = `
  edges {
    node {
      promoHeader {
        couponCode
        couponStartDate
        couponEndDate
        promoId
        promoDesc
        storeAvailableInd
        webEnabledInd
      }
    }
  }
`

export interface CouponModel {
  id: string;
  code: string
  description: string;
  startDate: string;
  endDate: string;
  inStore: boolean;
  online: boolean;
}
