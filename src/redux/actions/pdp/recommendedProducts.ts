import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { fetchRecommendedProducts } from 'src/endpoints/atgGateway/pdp/recommendedProducts'

export const SET_RECOMMENDED_FOR_YOU_PRODUCTS = 'SET_RECOMMENDED_FOR_YOU_PRODUCTS'
export const setRecommendedForYouProducts = makeActionCreator<string[]>(
  SET_RECOMMENDED_FOR_YOU_PRODUCTS,
)

export const getRecommendedForYouProductsAction: (
  ean?: string,
) => ThunkedAction<State> = (ean) => async (dispatch, getState) => {
  const response = await fetchRecommendedProducts(ean)

  if (response.ok) {
    if (response.data.response.recommendedEans) {
      const eans = response.data.response.recommendedEans.map(
        (element) => element.eanId,
      )
      dispatch(setRecommendedForYouProducts(eans))
    } else {
      dispatch(setRecommendedForYouProducts([]))
    }
  } else {
    dispatch(setRecommendedForYouProducts([]))
  }
}
