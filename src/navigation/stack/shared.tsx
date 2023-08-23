import React from 'react'
import Header from 'src/controls/navigation/Header'
import { Params } from 'src/constants/routes'

import AskRecommendationScreen from 'src/screens/community/AskRecommendationScreen'
import AnswerRecommendationScreen from 'src/screens/community/AnswerRecommendationScreen'
import QuestionsListCategories from 'src/screens/community/QuestionsListCategories'
import RecommendationScreen from 'src/screens/community/RecommendationScreen'
import RecommendationCommentScreen from 'src/screens/community/RecommendationCommentScreen'
import RecommendedUsersScreen from 'src/screens/community/RecommendedUsersScreen'

import ProfileScreen from 'src/screens/profile/Profile'
import ProfileMyProfileScreen from 'src/screens/profile/MyProfile'
import AccountGiftCardsScreen from 'src/screens/profile/AccountGiftCards/AccountGiftCardsScreen'
import AccountSettingsScreen from 'src/screens/profile/AccountSettings/AccountSettings'
import AccountPaymentMethodsScreen from 'src/screens/profile/AccountSettings/PaymentMethods'
import ProfileSettingsScreen from 'src/screens/profile/Settings'
import ProfileEditAboutScreen from 'src/screens/profile/EditAbout'
import ProfileEditGenreInterestsScreen from 'src/screens/profile/EditGenreInterests'
import AccountNameScreen from 'src/screens/profile/AccountSettings/AccountEditName'
import AccountEmailAddressScreen from 'src/screens/profile/AccountSettings/AccountEditEmailAddress'
import AccountPhoneNumberScreen from 'src/screens/profile/AccountSettings/AccountEditPhoneNumber'
import PasswordResetMessageScreen from 'src/screens/profile/AccountSettings/PasswordResetMessage'
import PasswordAssistantFormScreen from 'src/screens/profile/AccountSettings/PasswordAssistantForm'
import AccountSecurityQuestionScreen from 'src/screens/profile/AccountSettings/AccountSecurityQuestion'
import ExplicitContentSettingScreen from 'src/screens/profile/AccountSettings/ExplicitContentSettings'
import PasswordAssistantScreen from 'src/screens/profile/AccountSettings/PasswordAssistant'
import ProfileEditNameScreen from 'src/screens/profile/EditName'
import ProfileEditPenNameScreen from 'src/screens/profile/EditPenName'
import ProfileQaPostsScreen from 'src/screens/profile/QaPosts'
import ProfileFollowingScreen from 'src/screens/profile/Following'
import ProfileFollowersScreen from 'src/screens/profile/Followers'
import LegalAndPolicies from 'src/screens/profile/LegalAndPolicies'
import editPassword from 'src/screens/profile/EditPassword'
import AddressBook from 'src/screens/profile/AddressBook'
import NotificationsScreen from 'src/screens/profile/AccountSettings/AccountNotifications'

import MyBooksCollectionsListScreen from 'src/screens/myBooks/CollectionsList'
import MyBooksAddToListScreen from 'src/screens/myBooks/AddToList'
import AddToReadingStatusList from 'src/screens/myBooks/AddToReadingStatusList'

import PdpScreen from 'src/screens/pdp/Pdp'
import PdpReadersListScreen from 'src/screens/pdp/ReadersList'
import PdpRelatedQuestionsListScreen from 'src/screens/pdp/RelatedQuestionsList'
import OverviewScreen from 'src/screens/pdp/Overview'
import ProductDetailsScreen from 'src/screens/pdp/ProductDetails'
import ProtectionPlanDetailsScreen from 'src/screens/pdp/WarrantyDetails'
import WriteReiewScreen from 'src/screens/pdp/WriteReview'
import ReadListReviews from 'src/screens/pdp/ReadListReviews'
import ReadItemReview from 'src/screens/pdp/ReadItemReview'

import TracksScreen from 'src/screens/pdp/Tracks'
import ContributorsScreen from 'src/screens/pdp/Contributors'
import TOCScreen from 'src/screens/pdp/TOC'
import AuthorDetails from 'src/screens/pdp/AuthorDetails'
import AuthorSearchResults from 'src/screens/pdp/AuthorSearchResults'

import ListDisplay from 'src/screens/myBooks/ListDisplay'
import ReadingStatusList from 'src/screens/myBooks/ReadingStatusList'

import ReadBookSelection from 'src/screens/onboarding/ReadBookSelection'
import LoginScreen from 'src/screens/login/Login'

import Webview from 'src/screens/webview/WithUserSession'
import PdfScreen from 'src/screens/webview/Pdf'

import Routes from 'src/constants/routes'
import ProductImagesScreen from 'src/screens/pdp/ProductImages'
import SelectStore from 'src/screens/cart/SelectStore'
import NookDeviceSpec from 'src/components/Pdp/NookDeviceSpec'
import SearchScreen from 'src/screens/search/Search'

import WishListsMyLists from 'src/screens/wishLists/MyLists'
import WishListsDetails from 'src/screens/wishLists/Details'
import OrderDetailsScreen from 'src/screens/profile/OrderHistory/OrderDetailsScreen'
import AccountMembership from 'src/screens/profile/AccountMembership'
import AccountOrderHistory from 'src/screens/profile/AccountOrderHistory'
import BrowseDetails from 'src/screens/home/Browse'
import AccountGiftCardsBalance from 'src/screens/profile/AccountGiftCards/AccountGiftCardsBalance'

export default {
  [Routes.COMMUNITY__ASK]: AskRecommendationScreen,
  [Routes.COMMUNITY__ANSWER]: AnswerRecommendationScreen,
  [Routes.COMMUNITY__QUESTIONS_CATEGORIES]: QuestionsListCategories,
  [Routes.COMMUNITY__QUESTION]: {
    screen: RecommendationScreen,
    path: 'questions/:questionId',
  },
  [Routes.COMMUNITY__COMMENT]: {
    screen: RecommendationCommentScreen,
    path: 'answers/:answerId',
  },
  [Routes.COMMUNITY__RECOMMENDED_USER]: RecommendedUsersScreen,

  [Routes.PROFILE__MAIN]: ProfileScreen,
  [Routes.PROFILE__MY_PROFILE]: ProfileMyProfileScreen,
  [Routes.ACCOUNT_SETTINGS]: AccountSettingsScreen,
  [Routes.ACCOUNT_ORDER_DETAILS]: OrderDetailsScreen,
  [Routes.ACCOUNT_PAYMENT_METHODS]: AccountPaymentMethodsScreen,
  [Routes.ACCOUNT__GIFT_CARDS]: AccountGiftCardsScreen,
  [Routes.ACCOUNT__MEMBERSHIP]: AccountMembership,
  [Routes.PROFILE__SETTINGS]: ProfileSettingsScreen,
  [Routes.PROFILE__EDIT_ABOUT]: ProfileEditAboutScreen,
  [Routes.PROFILE__EDIT_GENRE_INTERESTS]: ProfileEditGenreInterestsScreen,
  [Routes.PROFILE__EDIT_NAME]: ProfileEditNameScreen,
  [Routes.ACCOUNT__NAME]: AccountNameScreen,
  [Routes.ACCOUNT__GIFT_CARDS_BALANCE]: AccountGiftCardsBalance,
  [Routes.ACCOUNT__EMAIL__ADDRESS]: AccountEmailAddressScreen,
  [Routes.ACCOUNT__PHONE__NUMBER]: AccountPhoneNumberScreen,
  [Routes.PASSWORD__RESET__MESSAGE]: PasswordResetMessageScreen,
  [Routes.PASSWORD__PASSWORD__ASSISTANT__FORM]: PasswordAssistantFormScreen,
  [Routes.ACCOUNT__SECURITY__QUESTION]: AccountSecurityQuestionScreen,
  [Routes.ACCOUNT__EXPLICIT__CONTENT__SETTING]: ExplicitContentSettingScreen,
  [Routes.PASSWORD__ASSISTANT]: PasswordAssistantScreen,
  [Routes.PROFILE__EDIT_PEN_NAME]: ProfileEditPenNameScreen,
  [Routes.PROFILE__QA_POSTS]: ProfileQaPostsScreen,
  [Routes.PROFILE__FOLLOWING]: ProfileFollowingScreen,
  [Routes.PROFILE__FOLLOWERS]: ProfileFollowersScreen,
  [Routes.PROFILE__LEGAL]: LegalAndPolicies,
  [Routes.PROFILE__EDIT_PASSWORD]: editPassword,
  [Routes.PROFILE__ADDRESS_BOOK]: AddressBook,
  [Routes.ACCOUNT__NOTIFICATIONS]: NotificationsScreen,

  [Routes.PDP__MAIN]: PdpScreen,
  [Routes.PDP__READERS_LIST]: PdpReadersListScreen,
  [Routes.PDP__RELATED_QUESTIONS_LIST]: PdpRelatedQuestionsListScreen,
  [Routes.PDP__READ_ITEM_REVIEW]: ReadItemReview,
  [Routes.PDP__OVERVIEW]: OverviewScreen,
  [Routes.PDP__PRODUCT_DETAILS]: ProductDetailsScreen,
  [Routes.PDP__PROTECTION_PLAN_DETAILS]: ProtectionPlanDetailsScreen,
  [Routes.PDP__NOOK_DEVICE]: NookDeviceSpec,
  [Routes.PDP__WRITE_REVIEW]: WriteReiewScreen,
  [Routes.PDP__READ_LIST_REVIEWS]: ReadListReviews,
  [Routes.PDP__PRODUCT_IMAGES]: ProductImagesScreen,
  [Routes.PDP__TRACKS]: TracksScreen,
  [Routes.PDP__CONTRIBUTORS]: ContributorsScreen,
  [Routes.PDP__TOC]: TOCScreen,
  [Routes.PDP__SELECT_STORE]: SelectStore,
  [Routes.PDP__AUTHOR_DETAILS]: AuthorDetails,
  [Routes.PDP__AUTHOR_SEARCH_RESULTS]: AuthorSearchResults,

  [Routes.MY_BOOKS__COLLECTIONS_LIST]: MyBooksCollectionsListScreen,
  [Routes.MY_BOOKS__LIST]: ListDisplay,
  [Routes.MY_BOOKS__ADD_TO_LIST]: MyBooksAddToListScreen,
  [Routes.MY_BOOKS__READING_STATUS_LIST]: ReadingStatusList,
  [Routes.MY_BOOK__ADD_TO_READING_STATUS]: AddToReadingStatusList,

  [Routes.WEBVIEW__WITH_SESSION]: Webview,
  [Routes.WEBVIEW__PDF]: PdfScreen,

  [Routes.ONBOARDING__READ_BOOKS]: ReadBookSelection,
  [Routes.WELCOME__LOGIN]: LoginScreen,

  [Routes.WISHLIST__MY_LISTS]: WishListsMyLists,
  [Routes.WISHLIST__DETAILS]: {
    screen: WishListsDetails,
    path: 'wishlist/:wishlistId',
  },

  [Routes.HOME__BROWSE]: {
    screen: BrowseDetails,
    path: `wishlist/:${Params.BROWSE_URL}`,
  },

  [Routes.SEARCH__SEARCH]: {
    screen: SearchScreen,
    path: `search/:${Params.SEARCH_QUERY}`,
    navigationOptions: {
      header: (headerProps) => <Header headerProps={headerProps} />,
    },
  },

  [Routes.ACCOUNT__ORDER_HISTORY]: AccountOrderHistory,
}
