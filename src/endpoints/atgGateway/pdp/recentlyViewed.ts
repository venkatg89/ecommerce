import atgApiRequest from 'src/apis/atgGateway'

const RECENTLY_VIEWED = '/product-details/getRecentlyViewedProducts'

export const fetchRecentlyViewed = (ean?: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: RECENTLY_VIEWED,
    data: {
      ...(ean && { productId: `prd${ean}` }),
    },
  })
