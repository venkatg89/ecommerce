import { Dispatch } from 'redux'
import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { Routes, navigate, popToTop } from 'src/helpers/navigationService'
import { NavigationParams } from 'react-navigation'
import { Ean } from 'src/models/BookModel'

import { ONBOARDING_MIN_INTERESTS_SELECTED, ONBOARDING_MIN_READ_BOOKS_SELECTED } from 'src/constants/onboarding'

import { onboardingStepStateSelector } from 'src/redux/selectors/onboarding/stepsSelector'
import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'

import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

export const USER_ONBOARDING_ADD_BOOK = 'USER__ONBOARDING_ADD_READ_BOOK'
export const addOnboardingBookAction = makeActionCreator<Ean>(USER_ONBOARDING_ADD_BOOK)

export const USER_ONBOARDING_DELETE_BOOK = 'USER__ONBOARDING_DELETE_READ_BOOK'
export const removeOnboardingBookAction = makeActionCreator<Ean>(USER_ONBOARDING_DELETE_BOOK)

export const USER_ONBOARDING_RESET_BOOKS = 'USER__ONBOARDING_RESET_READ_BOOKS'
export const resetOnboardingBookAction = makeActionCreator<void>(USER_ONBOARDING_RESET_BOOKS)

export const ONBOARDING_MOVED_PAST_READ_BOOK_SELECTION = 'ONBOARDING__MOVED_PAST_READ_BOOK_SELECTION'
export const onboardingMovedPastBookSelectionAction = makeActionCreator<void>(ONBOARDING_MOVED_PAST_READ_BOOK_SELECTION)

export const ONBOARDING_MOVED_PAST_REGISTER_LOGIN = 'ONBOARDING__PAST_REGISTER_LOGIN'
export const onboardingMovedPastRegisterLoginAction = makeActionCreator<void>(ONBOARDING_MOVED_PAST_REGISTER_LOGIN)

export const ONBOARDING_PUSH_PERMISSIONS_REQUESTED = 'ONBOARDING__PUSH_PERMISSIONS_REQUESTED'
export const onboardingPushPermissionsRequested = makeActionCreator<void>(ONBOARDING_PUSH_PERMISSIONS_REQUESTED)

export const SET_ROUTE_TO_REDIRECT_POST_LOGIN = 'SET_ROUTE_TO_REDIRECT_POST_LOGIN'
export const setRouteToRedirectPostLoginAction = makeActionCreator(SET_ROUTE_TO_REDIRECT_POST_LOGIN)

export const CLEAR_POST_LOGIN_REDIRECT_ROUTE = 'CLEAR_POST_LOGIN_REDIRECT_ROUTE'
export const clearRouteToRedirectPostLoginAction = makeActionCreator(CLEAR_POST_LOGIN_REDIRECT_ROUTE)

const PUSH_NOTIFICATION_PROMPT_DELAY_IF_REQUESTED = 2000

const userReadBooksCount = (state: State) => {
  let readCount = 0
  return readCount
}

const getRouteNameOfNextOnboardingStep = async (state: State, dispatch: Dispatch<State>) => {
  const movedPastSteps = onboardingStepStateSelector(state)

  // NON-SKIPPABLE - do check every time.
  // Interests/Communities/Categories - If the user did not select 3x interests, they should.
  if (state.user.community.favoriteCategories.length < ONBOARDING_MIN_INTERESTS_SELECTED) {
    // TODO REMOVEMILQ
    // return Routes.ONBOARDING__CHOOSE_CATEGORY
    return Routes.HOME__MAIN
  }

  // IS-SKIPPABLE
  // Does the user have any read books in their profile, or books marked read during onboarding?
  if (!movedPastSteps.readBookSelection) {
    const userCountBooks = userReadBooksCount(state)
    logger.info(`userCountBooks for onboarding is ${userCountBooks}`)
    if (userReadBooksCount(state) < ONBOARDING_MIN_READ_BOOKS_SELECTED) {
      return Routes.ONBOARDING__READ_BOOKS
    }
    await dispatch(onboardingMovedPastBookSelectionAction())
  }

  // IS-SKIPPABLE
  // Is the user logged in?
  if (!movedPastSteps.loginRegister) {
    if (!isUserLoggedInSelector(state)) {
      return Routes.MODAL__SIGNUP
    }
    await dispatch(onboardingMovedPastRegisterLoginAction())
  }

  if (movedPastSteps.routeState !== null) {
    const nextRoute = movedPastSteps.routeState
    await dispatch(clearRouteToRedirectPostLoginAction())
    return nextRoute
  }

  return null // Onboarding was completed, no next step
}

const getRouteNameForAppStart = async (state: State, dispatch: Dispatch<State>) => {
  const nextOnboardingRoute = await getRouteNameOfNextOnboardingStep(state, dispatch)
  return nextOnboardingRoute ?
    Routes.ONBOARDING__WELCOME : // Still some onboarding to do, show the welcome screen first
    Routes.HOME__MAIN // No more onboarding
}

export const navigateToNextOnboardingStepOrToHomeAction: (params?: NavigationParams, navigateHome?: boolean) => ThunkedAction<State> =
(params = [], navigateHome) => async (dispatch, getState) => {
  if (navigateHome) {
    navigate(Routes.HOME__MAIN)
    return
  }

  const state = getState()
  const nextOnboardingRoute = await getRouteNameOfNextOnboardingStep(state, dispatch)
  if (nextOnboardingRoute !== null && typeof nextOnboardingRoute === 'object') {
    const { route, params: newParams } = nextOnboardingRoute
    popToTop(true)
    navigate(route, newParams)
    return
  }
  navigate((nextOnboardingRoute !== null) ? nextOnboardingRoute : Routes.HOME__MAIN, params)
}


export const navigateToFirstAppScreenAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const state = getState()
    const route = await getRouteNameForAppStart(state, dispatch)
    navigate(route)
  }

export const askForPushPermissionsIfWeHaveNotYet: (withDelay: boolean) => ThunkedAction<State> =
  withDelay => async (dispatch, getState) => {
    const state = getState()
    if (!state.user.onboarding.push.askedForPermission) {
      await dispatch(onboardingPushPermissionsRequested())
      if (withDelay) {
        setTimeout(() => {}, PUSH_NOTIFICATION_PROMPT_DELAY_IF_REQUESTED)
      } else {
      }
    }
  }
