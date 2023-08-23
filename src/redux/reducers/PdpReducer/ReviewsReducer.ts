import { Reducer } from 'redux'

import { SET_REVIEWS, SET_REVIEW_TAGS } from 'src/redux/actions/pdp/bazaarvoice'
import { ReviewsStateModel } from 'src/models/PdpModel'

type ReviewsState = Record<number, ReviewsStateModel> | null
const DEFAULT: ReviewsState = null

const reviews: Reducer<ReviewsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_REVIEWS: {
      const { ean, reviews } = action.payload
      return {
        ...state,
        [ean]: {
          submitReviewDetails: state && state[ean]?.submitReviewDetails,
          ...reviews,
        },
      }
    }

    case SET_REVIEW_TAGS: {
      const { ean, submitReviewDetails } = action.payload
      return {
        ...state,
        [ean]: {
          ...(state && state[ean]),
          submitReviewDetails: submitReviewDetails,
        },
      }
    }

    default:
      return state
  }
}

export default reviews
