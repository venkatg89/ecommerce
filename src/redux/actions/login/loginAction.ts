import { ThunkAction } from 'redux-thunk'
import { Dispatch } from 'redux'
import { LoginCredentialStore } from 'src/apis/session/sessions'
import { refreshCartAction } from 'src/redux/actions/shop/cartAction'
import { State } from 'src/redux/reducers'
import { navigateToNextOnboardingStepOrToHomeAction } from '../onboarding'
import { loginAnewOrRestoreLogin } from 'src/apis/session/login'
import { SERVER_LOGIN } from 'src/constants/formErrors'

// import { fetchMyRelationsAction } from 'src/redux/actions/user/community/relationsAction'
// import { fetchAgreedAnswersAction } from 'src/redux/actions/user/community/agreeAnswersAction'
// import { fetchMyProfileAction } from 'src/redux/actions/user/profileAction'
// import { fetchCommunityInterestsAction } from 'src/redux/actions/communities/fetchInterestsAction'
import { setUserSessionAction } from 'src/redux/actions/user/sessionsAction'
import {
  addEventAction,
  LL_CUSTOMER_LOGGED_IN,
} from 'src/redux/actions/localytics'

import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'

// import { myMilqProfileSelector } from 'src/redux/selectors/userSelector'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'

import { userUILoginInProgress, userUILoginEnded } from './basicActionsPayloads'
import { onboardingStepStateSelector } from 'src/redux/selectors/onboarding/stepsSelector'
import { homeDiscoveryClearContentSourceAction } from 'src/redux/actions/legacyHome/discoveryActions'
import { fetchHomeContentAction } from 'src/redux/actions/legacyHome/fetchHomeContentAction'

import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

export const fetchPostLoginData = async (dispatch: Dispatch<State>) => {
  try {
    // TODO REMOVEMILQ these would fail, causing login to fail as well; They probably need to be added later
    // await Promise.all([
    //   dispatch(fetchMyProfileAction()),
    //   dispatch(fetchCommunityInterestsAction()),
    // ])

    const promises = [
      // Mark this as a session
      dispatch(setUserSessionAction()),
      // Fetch other milq items
      // TODO REMOVEMILQ same as above
      // dispatch(fetchAgreedAnswersAction()),
      // dispatch(fetchMyRelationsAction()),
      // Post-login node data
      // dispatch(fetchCollectionsForLocalUserAction()),
    ]
    // Run all in parallel
    await Promise.all(promises)
    return true
  } catch (e) {
    logger.warn('Error during fetchPostLoginData')
    return false
  }
}

export const storeCredentialAndLogin: (
  username: string,
  password: string,
  gotoHome: boolean,
) => ThunkAction<any, State, void> = (username, password, gotoHome) => async (
  dispatch,
  getState,
) => {
  await dispatch(userUILoginInProgress())

  // Update the credentials in the Secure store...
  await LoginCredentialStore.set({ username, password })
  // ... and let a login action take care of the rest

  const loginResult = await loginAnewOrRestoreLogin({})

  if (loginResult === true) {
    await fetchPostLoginData(dispatch)
    await dispatch(refreshCartAction())
    // await new Promise((resolve) => { setTimeout(resolve, 6000) })
    const state = getState()
    const atgAccount = myAtgAccountSelector(state)

    if (atgAccount) {
      const { firstName, lastName, email } = atgAccount

      const LLCustomer = {
        firstName: firstName,
        lastName: lastName,
        fullName: lastName + ' ' + firstName,
        emailAddress: email,
      }

      dispatch(addEventAction(LL_CUSTOMER_LOGGED_IN, LLCustomer, true))
    }

    if (gotoHome !== false) {
      // reload Home Discovery when switching from guest to logged-in session
      if (onboardingStepStateSelector(getState()).loginRegister) {
        await dispatch(homeDiscoveryClearContentSourceAction())
        // no need to wait for it since the user won't land on Home screen
        dispatch(fetchHomeContentAction())
      }
      await dispatch(navigateToNextOnboardingStepOrToHomeAction())
    }
    await dispatch(userUILoginEnded())
    return true
  }

  const form = formErrorsSelector(getState())!
  const error = form[SERVER_LOGIN]
  if (error) {
  }
  await dispatch(userUILoginEnded())
  return false
}
