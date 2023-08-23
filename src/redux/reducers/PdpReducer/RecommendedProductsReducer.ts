import { Reducer } from 'redux'

import { SET_RECOMMENDED_FOR_YOU_PRODUCTS } from 'src/redux/actions/pdp/recommendedProducts'

export type RecommendedForYouProductState = string[]

const DEFAULT: RecommendedForYouProductState = []

const recommendedForYouProducts: Reducer<RecommendedForYouProductState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_RECOMMENDED_FOR_YOU_PRODUCTS: {
      const eans = action.payload
      return eans
    }

    default:
      return state
  }
}

export default recommendedForYouProducts
