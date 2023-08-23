import { combineReducers } from 'redux'

import {
  makeApiStatusReducerUsingActionNames,
  makeApiStatusReducerUsingApiAction,
  makeDictionaryApiStatusReducerUsingApiAction,
} from 'src/helpers/redux/makeApiStateReducer'
import { ApiStatus } from 'src/models/ApiStatus'

import signUp from 'src/redux/actions/login/signupAction'
import passwordReset from 'src/redux/actions/resetPasswordAction'
import emailAddress from 'src/redux/actions/user/emailAddressAction'
import phoneNumber from 'src/redux/actions/user/phoneNumberAction'
import validateSecurityAnswer from 'src/redux/actions/user/validateSecurityAnswerAction'
import {
  atgAccountApiActions,
  atgEditAccountApiActions,
} from 'src/redux/actions/user/atgAccountAction'
import { bookDetailsApiStatusActions } from 'src/redux/actions/book/bookDetails'
import { bookFetchApiStatusActions } from 'src/redux/actions/book/bookAction'
import { getRecommendedProductsActions } from 'src/redux/actions/legacyHome/featuredRecommendationsCarouselReadBooksAction'
import { browseDetailsApiActions } from 'src/redux/actions/pdp/browseDetails'
import { setOrderHistoryApiStatusActions } from 'src/redux/actions/user/orderHistory'
import { Ean } from 'src/models/BookModel'

export interface ApiState {
  signUp: ApiStatus
  passwordReset: ApiStatus
  account: ApiStatus
  bookDetails: Record<Ean, ApiStatus>
  bookFetch: Record<Ean, ApiStatus>
  recommendedProducts: ApiStatus
  editAccount: ApiStatus
  browseDetails: ApiStatus
  validateSecurityAnswer: ApiStatus
  orderHistory: ApiStatus
  emailAddress: ApiStatus
  phoneNumber: ApiStatus
}

export default combineReducers({
  // old style - to convert
  signUp: makeApiStatusReducerUsingActionNames(
    signUp.USER_SIGNED_UP_FETCHING,
    signUp.USER_SIGNED_UP_SUCCESS,
    signUp.USER_SIGNED_UP_FAILED,
  ),
  passwordReset: makeApiStatusReducerUsingActionNames(
    passwordReset.USER_RESET_PASSWORD_FETCHING,
    passwordReset.USER_RESET_PASSWORD_SUCCESS,
    passwordReset.USER_RESET_PASSWORD_FAILED,
  ),
  emailAddress: makeApiStatusReducerUsingActionNames(
    emailAddress.EMAIL_ADDRESS_FETCHING,
    emailAddress.EMAIL_ADDRESS_SUCCESS,
    emailAddress.EMAIL_ADDRESS_FAILED,
    emailAddress.EMAIL_ADDRESS_STATUS_RESET,
  ),
  phoneNumber: makeApiStatusReducerUsingActionNames(
    phoneNumber.PHONE_NUMBER_FETCHING,
    phoneNumber.PHONE_NUMBER_SUCCESS,
    phoneNumber.PHONE_NUMBER_FAILED,
    phoneNumber.PHONE_NUMBER_STARUS_RESET,
  ),
  validateSecurityAnswer: makeApiStatusReducerUsingActionNames(
    validateSecurityAnswer.VALIDATE_SECURITY_ANSWER_FETCHING,
    validateSecurityAnswer.VALIDATE_SECURITY_ANSWER_SUCCESS,
    validateSecurityAnswer.VALIDATE_SECURITY_ANSWER_FAILED,
  ),

  // new style
  account: makeApiStatusReducerUsingApiAction(atgAccountApiActions.types),
  bookDetails: makeDictionaryApiStatusReducerUsingApiAction(
    bookDetailsApiStatusActions().types,
  ),
  bookFetch: makeDictionaryApiStatusReducerUsingApiAction(
    bookFetchApiStatusActions().types,
  ),
  recommendedProducts: makeApiStatusReducerUsingApiAction(
    getRecommendedProductsActions.types,
  ),
  editAccount: makeApiStatusReducerUsingApiAction(
    atgEditAccountApiActions.types,
  ),
  browseDetails: makeApiStatusReducerUsingApiAction(
    browseDetailsApiActions.types,
  ),
  orderHistory: makeApiStatusReducerUsingApiAction(
    setOrderHistoryApiStatusActions.types,
  ),
})
