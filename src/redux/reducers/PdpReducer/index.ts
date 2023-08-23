import { combineReducers } from 'redux'

import bookDetails, { BookDetailsState } from './BookDetailsReducer'
import bookRecommendedBookIdList, {
  BookRecommendedBookIdListState,
} from './BookRecommendedBookIdList'
import bookRelatedQuestionIdList, {
  BookRelatedQuestionIdListState,
} from './BookRelatedQuestionIdList'
import workIdReadingList, { WorkIdReadingListState } from './WorkIdReadingList'
import recentlyViewed, { RecentlyViewedState } from './RecentlyViewedReducer'
import browseDetails, { BrowseDetailsState } from './BrowseDetailsReducer'
import recommendedForYouProducts, {
  RecommendedForYouProductState,
} from './RecommendedProductsReducer'
import nookDeviceSpecifications, {
  NookDeviceSpecificationsState,
} from './NookDeviceSpec'
import reviews from './ReviewsReducer'
import { ReviewsStateModel } from 'src/models/PdpModel'

export interface PdpState {
  bookDetails: BookDetailsState
  bookRecommendedBookIdList: BookRecommendedBookIdListState
  bookRelatedQuestionIdList: BookRelatedQuestionIdListState
  workIdReadingList: WorkIdReadingListState
  recentlyViewed: RecentlyViewedState
  browseDetails: BrowseDetailsState
  recommendedForYouProducts: RecommendedForYouProductState
  nookDeviceSpecifications: NookDeviceSpecificationsState
  reviews: ReviewsStateModel
}

export default combineReducers<PdpState>({
  bookDetails,
  bookRecommendedBookIdList,
  bookRelatedQuestionIdList,
  workIdReadingList,
  recentlyViewed,
  browseDetails,
  recommendedForYouProducts,
  nookDeviceSpecifications,
  reviews,
})
