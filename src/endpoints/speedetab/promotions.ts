import config from 'config'

import speedetabApiRequest from 'src/apis/speedetab'

import { CafePromotion } from 'src/models/CafeModel/Promotion'

export const fetchCafePromotions = () => speedetabApiRequest({
  method: 'GET',
  endpoint: `/users/v1/merchants/${config.api.speedetab.merchantId}/promotions`,
})

export const normalizeCafePromotionResponseData = (data: any): CafePromotion[] => {
  const { promotions = [] } = data
  return promotions.map(promotion => ({
    id: promotion.id,
    startDate: promotion.start_date,
    endDate: promotion.end_date,
    bannerImage: promotion.banner_image,
  }))
}
