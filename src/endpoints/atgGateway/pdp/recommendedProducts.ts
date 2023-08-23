import atgApiRequest from 'src/apis/atgGateway'

const RECOMMENDED_PRODUCTS = '/product-details/getRecommendedProducts'

export const fetchRecommendedProducts = (ean?: string) =>
  atgApiRequest({
    method: 'GET',
    endpoint: RECOMMENDED_PRODUCTS,
    params: { ean: ean, numberOfResults: 8, requestForRender: 'yes' },
  })
