import { fetchCafePromotions, normalizeCafePromotionResponseData } from 'src/endpoints/speedetab/promotions'
import { CafePromotion } from 'src/models/CafeModel/Promotion'

export const getCafePromotionsData = async (): Promise<CafePromotion[]> => {
    const response = await fetchCafePromotions()

    if (response.ok) {
      return normalizeCafePromotionResponseData(response.data)
    }
    return []
  }
