import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import {
  getReviews,
  submitReviews,
  submitReviewDetailsNormalizer,
} from 'src/endpoints/bazaarvoice/reviews'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { REVIEW_FORM } from 'src/constants/formErrors'
export const SET_REVIEWS = 'SET_REVIEWS'
export const SET_REVIEW_TAGS = 'SEND_REVIEWS'
export const setReviews = makeActionCreator(SET_REVIEWS)
export const setReviewTags = makeActionCreator(SET_REVIEW_TAGS)

export const getReviewsAction: (ean: string) => ThunkedAction<State> = (
  ean,
) => async (dispatch) => {
  let reviews = {
    ratings: 0,
    reviewsCount: 0,
    reviewsResults: [],
    reviewStatistics: [],
    recommend: 0,
  }
  const response = await getReviews(ean)
  if (response.ok) {
    if (response.data && Object.keys(response.data.Includes).length > 0) {
      const newEan = Object.keys(response.data.Includes.Products)[0]
      reviews = {
        ratings:
          response.data.Includes.Products[newEan].ReviewStatistics
            .AverageOverallRating,
        reviewsCount: response.data.Includes.Products[newEan].TotalReviewCount,
        reviewsResults:
          response.data.Includes.Products[newEan] &&
          response.data.Results.map((el) => el),
        reviewStatistics:
          response.data.Includes.Products[newEan].ReviewStatistics
            .RatingDistribution,
        recommend:
          response.data.Includes.Products[newEan].ReviewStatistics
            .RecommendedCount,
      }
    }
    dispatch(setReviews({ ean, reviews }))
  }
}

export const submitReviewAction: (params) => ThunkedAction<State> = (
  params,
) => async (dispatch) => {
  const response = await submitReviews(params)
  if (response.ok && response.data && !response.data.HasErrors) {
    if (response.data.Data.Fields) {
      let submitReviewDetails = submitReviewDetailsNormalizer(
        response.data.Data.Fields,
      )
      dispatch(setReviewTags({ submitReviewDetails, ean: params.ProductId }))
    }
  } else {
    const error = response.data.FormErrors.FieldErrors
    const keys = Object.keys(error)
    const formErrors = keys.map((key) => ({
      formFieldId: error[key].Field,
      error: error[key].Message,
    }))
    await dispatch(setformErrorMessagesAction(REVIEW_FORM, formErrors))
  }
}
