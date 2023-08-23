import { CouponModel } from 'src/models/StoreModel/CouponModel'

export const normalizeCoupon = (coupon): CouponModel => ({
  id: coupon.promoHeader.promoId,
  code: coupon.promoHeader.couponCode,
  description: coupon.promoHeader.promoDesc,
  startDate: coupon.promoHeader.couponStartDate,
  endDate: coupon.promoHeader.couponEndDate,
  inStore: !!coupon.promoHeader.storeAvailableInd,
  online: coupon.promoHeader.webEnabledInd === 'Y',
})
