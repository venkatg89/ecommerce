import { Reducer } from 'redux'
import { SET_USER_APP_REVIEW } from 'src/redux/actions/user/appReviewAction'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

export enum ReviewType {
  RATED = 'RATED',
  SENT_FEEDBACK = 'SENT_FEEDBACK'
}
interface AppReviewModel {
  reviewType: ReviewType
  forVersion: string
  submittedAt: Date
}

export type AppReviewState = Nullable<AppReviewModel>

const DEFAULT: AppReviewState = null

const appReview: Reducer<AppReviewState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_USER_APP_REVIEW: {
      const { reviewType, forVersion } = action.payload
      return {
        reviewType,
        forVersion,
        submittedAt: new Date(),
      }
    }

    case USER_SESSION_ESTABLISHED:
      return (action.payload as LoggedInPayload).nodeJs ? DEFAULT : state

    default:
      return state
  }
}

export default appReview
