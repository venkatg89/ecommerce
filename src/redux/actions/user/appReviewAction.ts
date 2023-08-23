import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { ReviewType } from 'src/redux/reducers/UserReducer/AppReviewReducer'

const packageJson = require('../../../../package.json')

export const SET_USER_APP_REVIEW = 'MY_USER__SET_APP_REVIEW'

const setUserAppReview = makeActionCreator(SET_USER_APP_REVIEW)

export const setAppReviewAction: (reviewType: ReviewType) => ThunkedAction<State> =
reviewType => async (dispatch, getState) => {
  await dispatch(setUserAppReview({
    reviewType,
    forVersion: packageJson.version,
  }))
}
