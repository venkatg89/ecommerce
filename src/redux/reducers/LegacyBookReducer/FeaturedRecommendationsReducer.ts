import { Reducer } from 'redux'
import { Ean } from 'src/models/BookModel'
import { SET_FEATURED_RECOMMENDATIONS_ACTION } from 'src/redux/actions/legacyHome/featuredRecommendationsCarouselReadBooksAction'
import { FILTER_FEATURE_RECOMMENDATIONS, RESTORE_FEATURE_RECOMMENDATIONS } from 'src/redux/actions/legacyHome/markBookAsNotInterestedAction'
import { HOME_DISCOVERY_CLEAR_CONTENT_SOURCE } from 'src/redux/actions/legacyHome/discoveryActions'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

export type FeaturedRecommendationsState = Ean[]

const DEFAULT: FeaturedRecommendationsState = []

const featuredRecommendations: Reducer<FeaturedRecommendationsState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_FEATURED_RECOMMENDATIONS_ACTION: {
      return action.payload
    }

    case FILTER_FEATURE_RECOMMENDATIONS: {
      return [
        ...state.filter(book => book !== action.payload),
      ]
    }

    case RESTORE_FEATURE_RECOMMENDATIONS:
      return [...new Set(state.concat(action.payload))]

    case HOME_DISCOVERY_CLEAR_CONTENT_SOURCE:
      return DEFAULT

    case USER_SESSION_ESTABLISHED:
      return (action.payload as LoggedInPayload).nodeJs ? DEFAULT : state

    default:
      return state
  }
}

export default featuredRecommendations
