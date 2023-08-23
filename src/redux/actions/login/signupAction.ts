import LLLocalytics from 'localytics-react-native'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'

import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { atgSignup } from 'src/endpoints/atgGateway/signup'
import { State } from 'src/redux/reducers'
import { orderClearAction } from 'src/redux/actions/shop/cartAction'
import { navigate, Routes } from 'src/helpers/navigationService'

import { storeCredentialAndLogin } from 'src/redux/actions/login/loginAction'
import { editPreferencesAction } from 'src/redux/actions/user/preferencesAction'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { setProgressOption } from 'src/redux/actions/form/progressAction'
import {
  addEventAction,
  LL_CUSTOMER_REGISTERED,
} from 'src/redux/actions/localytics'

import { ProfilePreferencesApiModel } from 'src/models/UserModel/MilqPreferences'
import { updateMyFavoriteCommunitiesAction } from 'src/redux/actions/user/community/favoriteCategoriesAction'

import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'

export interface SignupForm {
  firstName: string
  lastName: string
  penName: string
  email: string
  password: string
  confirmPassword: string
  secretQuestion: string
  secretAnswer: string
}

export const USER_SIGNED_UP_FETCHING = 'USER__SIGNED_UP_FETCHING'
export const USER_SIGNED_UP_SUCCESS = 'USER__SIGNED_UP_SUCCESS'
export const USER_SIGNED_UP_FAILED = 'USER__SIGNED_UP_FAILED'

export const signedUpFetchingAction = makeActionCreator(USER_SIGNED_UP_FETCHING)
export const signedUpSuccessAction = makeActionCreator(USER_SIGNED_UP_SUCCESS)
export const signedUpFailedAction = makeActionCreator(USER_SIGNED_UP_FAILED)

export const signupFetchActionWithErrorCode: (
  form: SignupForm,
) => ThunkedAction<State, string | undefined> = (form) => async (
  dispatch,
  getState,
) => {
  await dispatch(signedUpFetchingAction())

  // Remember the user's selected communities
  let communities: number[] = []
  {
    const state = getState()
    communities =
      (state.user.community && state.user.community.favoriteCategories) || []
  }

  const response = await atgSignup(form)

  if (response.ok) {
    await dispatch(setProgressOption({ start: '90%', end: '100%' }))
    // Store username/password and login.
    const login = await dispatch(
      storeCredentialAndLogin(form.email, form.password, false),
    )
    if (login) {
      // Save the user's interests on the server, if we defined some during onboarding.
      if (communities.length > 0) {
        await dispatch(updateMyFavoriteCommunitiesAction(communities))
      }

      // Set the profile pen name
      const postLoginState = getState()
      if (postLoginState.user.profile?.name !== form.penName) {
        const prefEdits: ProfilePreferencesApiModel = {
          name: form.penName,
          description: postLoginState.user.profile?.bio || '',
        }
        await dispatch(editPreferencesAction(prefEdits))
      }

      const atgAccount = myAtgAccountSelector(postLoginState)
      if (atgAccount) {
        const { atgUserId, firstName, lastName, email } = atgAccount

        const LLCustomer = {
          firstName: firstName,
          lastName: lastName,
          fullName: lastName + ' ' + firstName,
          emailAddress: email,
        }

        const hash = hmacSHA256(`${atgUserId}-${__DEV__ ? 'prod' : ''}`, atgUserId).toString(Hex)
        await Promise.all([
          dispatch(signedUpSuccessAction()),
          // dispatch(navigateToNextOnboardingStepOrToHomeAction()),
          dispatch(addEventAction(LL_CUSTOMER_REGISTERED, LLCustomer, true)),
        ])
        LLLocalytics.setCustomerId(hash)
        navigate(Routes.HOME__MAIN)
        dispatch(orderClearAction())
      }
    } else {
      await dispatch(signedUpFailedAction())
    }

    // get apistatus state for login if failed, pop a toast as navigation will fail?
    // currently is not sync between db TODO!!!!
    // if (getState().apiStatus.app.login === ApiStatus.FAILED) {
    //   pop toaster
    // }
  } else {
    const error = response.data.response
    const { code, message } = error
    // more details http://wiki.hq.bn-corp.com/display/atg/createUser+API
    if (code === 'BN684' || code === 'BN683') {
      await dispatch(
        setformErrorMessagesAction('signupForm', [
          { formFieldId: 'firstName', error: message },
        ]),
      )
    }
    if (code === 'BN519' || code === 'BN717' || code === 'BN150') {
      await dispatch(
        setformErrorMessagesAction('signupForm', [
          { formFieldId: 'email', error: message },
        ]),
      )
    }
    if (
      code === 'BN658' ||
      code === 'BN661' ||
      code === 'BN659' ||
      code === 'BN712'
    ) {
      await dispatch(
        setformErrorMessagesAction('signupForm', [
          { formFieldId: 'password', error: message },
        ]),
      )
    }
    if (code === 'BN686' || code === 'BN685') {
      await dispatch(
        setformErrorMessagesAction('signupForm', [
          { formFieldId: 'lastName', error: message },
        ]),
      )
    }
    if (code === 'BN660') {
      await dispatch(
        setformErrorMessagesAction('signupForm', [
          { formFieldId: 'password', error: message },
          { formFieldId: 'confirmPassword', error: message },
        ]),
      )
    }
    await dispatch(signedUpFailedAction())
    return code
  }
  return undefined
}

export default {
  USER_SIGNED_UP_FETCHING,
  USER_SIGNED_UP_SUCCESS,
  USER_SIGNED_UP_FAILED,
}
