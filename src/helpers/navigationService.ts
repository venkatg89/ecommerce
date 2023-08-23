import {
  NavigationActions,
  StackActions,
  NavigationParams,
  NavigationState,
} from 'react-navigation'

import Logger from 'src/helpers/logger'
import Routes, {
  Params,
  WebRoutes,
  AUTH_PRORECTED_ROUTES,
} from 'src/constants/routes'

import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'
import { StoreBackDoor } from 'src/redux/backdoor/interface'
import { debounce } from 'lodash'
import { setRouteToRedirectPostLoginAction } from 'src/redux/actions/onboarding'

import {
  LL_HOME_VIEWED,
  LL_STORES_VIEWED,
  LL_CART_VIEWED,
  LL_SEARCH_VIEWED,
  LL_CAFE_VIEWED,
  LL_PROFILE_VIEWED,
  LL_WISHLIST_VIEWED,
  LL_MY_ACCOUNT_VIEWED,
  LL_ACCOUNT_SETTINGS_VIEWED,
  LL_PAYMENT_METHODS_VIEWED,
  LL_ADDRESS_BOOK_VIEWED,
  LL_GIFT_CARDS_VIEWED,
  LL_MEMBERSHIPS_VIEWED,
  LL_REVIEW_PAGE_VIEWED,
  addEventAction,
} from 'src/redux/actions/localytics'

import moment from 'moment'

// If given multiple directions during 25ms - use the last one.
const NAVIGATION_DEBOUNCE_TIMEOUT = 25

// for convenience
export { Routes, Params, WebRoutes }

let store: Nullable<StoreBackDoor> = null
export const setStoreBackDoor = (storeBackDoor: StoreBackDoor) => {
  store = storeBackDoor
}

const logger = Logger.getInstance()

let _navigator
let _presentRoute: string = ''

// https://reactnavigation.org/docs/en/screen-tracking.html
// gets the current screen from navigation state
function getActiveRouteName(navigationState): string {
  if (!navigationState || !navigationState.routes) {
    return ''
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    // dive into nested navigators
    return getActiveRouteName(route)
  }
  return route.routeName
}

function getActiveRouteParams(navigationState): any {
  if (!navigationState || !navigationState.routes) {
    return undefined
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    // dive into nested navigators
    return getActiveRouteParams(route)
  }
  return route.params
}

export function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef
}

export function isAuthProtectedRoute(routeName: string) {
  return AUTH_PRORECTED_ROUTES.includes(routeName)
}

const addEvent = (name, time) => {
  store!.dispatch(addEventAction(name, { timeSpentInSeconds: time }))
}

const checkRoute = (newRoute, time) => {
  switch (newRoute) {
    case Routes.HOME__MAIN: {
      addEvent(LL_HOME_VIEWED, time)
      return
    }
    case Routes.MY_BN__SEARCH_STORE: {
      addEvent(LL_STORES_VIEWED, time)
      return
    }
    case Routes.CART__MAIN: {
      addEvent(LL_CART_VIEWED, time)
      return
    }
    case Routes.SEARCH__MAIN: {
      addEvent(LL_SEARCH_VIEWED, time)
      return
    }
    case Routes.CAFE__MAIN: {
      addEvent(LL_CAFE_VIEWED, time)
      return
    }
    case Routes.PROFILE__MAIN: {
      addEvent(LL_PROFILE_VIEWED, time)
      return
    }
    case Routes.WISHLIST__MY_LISTS: {
      addEvent(LL_WISHLIST_VIEWED, time)
      return
    }
    case Routes.PROFILE__MY_PROFILE: {
      addEvent(LL_MY_ACCOUNT_VIEWED, time)
      return
    }
    case Routes.ACCOUNT_SETTINGS: {
      addEvent(LL_ACCOUNT_SETTINGS_VIEWED, time)
      return
    }
    case Routes.ACCOUNT_PAYMENT_METHODS: {
      addEvent(LL_PAYMENT_METHODS_VIEWED, time)
      return
    }
    case Routes.PROFILE__ADDRESS_BOOK: {
      addEvent(LL_ADDRESS_BOOK_VIEWED, time)
      return
    }
    case Routes.ACCOUNT__GIFT_CARDS: {
      addEvent(LL_GIFT_CARDS_VIEWED, time)
      return
    }
    case Routes.ACCOUNT__MEMBERSHIP: {
      addEvent(LL_MEMBERSHIPS_VIEWED, time)
      return
    }
    case Routes.PDP__READ_LIST_REVIEWS: {
      addEvent(LL_REVIEW_PAGE_VIEWED, time)
      return
    }
    default:
      return
  }
}

let startTime = moment()

export const getCurrentRoute = () => {
  return _presentRoute
}

export function onNavigationStateChange(
  prevState: NavigationState,
  currentState: NavigationState,
  action,
) {
  const newRoute = getActiveRouteName(currentState)
  const prevRoute = getActiveRouteName(prevState)

  // When we navigate to cart/checkout from outside cart/checkout, make sure we reset flow
  if (
    (newRoute === Routes.CART__MAIN || newRoute === Routes.CART__CHECKOUT) &&
    prevRoute !== Routes.CART__MAIN &&
    prevRoute !== Routes.CART__CHECKOUT &&
    prevRoute !== Routes.CART__GIFT_OPTIONS
  ) {
    popToTop()
  }

  if (newRoute !== _presentRoute) {
    logger.info(`Navigating to: ${newRoute}`)
    if (isAuthProtectedRoute(newRoute)) {
      if (store!.dispatch(checkIsUserLoggedOutToBreakAction())) {
        const params = getActiveRouteParams(currentState)
        store!.dispatch(
          setRouteToRedirectPostLoginAction({ route: newRoute, params }),
        )
      }
    }
    const endTime = moment()
    const time = endTime.diff(startTime, 'seconds')

    checkRoute(_presentRoute, time)
    _presentRoute = newRoute
    startTime = moment()
  }
}

export function isRoute(route: string) {
  return route === _presentRoute
}

// since connecting react-navigation and redux is no longer actively supported
// use a reference to the root navigator to call navigate inside an action
export const navigate = debounce(
  (routeName: string, params?: NavigationParams) => {
    if (isAuthProtectedRoute(routeName)) {
      if (store!.dispatch(checkIsUserLoggedOutToBreakAction())) {
        store!.dispatch(
          setRouteToRedirectPostLoginAction({ route: routeName, params }),
        )
        return
      }
    }
    _navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      }),
    )
  },
  NAVIGATION_DEBOUNCE_TIMEOUT,
  { leading: false, trailing: true },
)

export function goBack() {
  _navigator.dispatch(NavigationActions.back())
}

export const push = debounce(
  (routeName: string, params?: NavigationParams) => {
    if (isAuthProtectedRoute(routeName)) {
      if (store!.dispatch(checkIsUserLoggedOutToBreakAction())) {
        store!.dispatch(
          setRouteToRedirectPostLoginAction({ route: routeName, params }),
        )
        return
      }
    }

    _navigator.dispatch(
      StackActions.push({
        routeName,
        params,
      }),
    )
  },
  NAVIGATION_DEBOUNCE_TIMEOUT,
  { leading: false, trailing: true },
)

export function pop() {
  _navigator.dispatch(
    StackActions.pop({
      n: 1,
    }),
  )
}

export function popN(n: number) {
  _navigator.dispatch(
    StackActions.pop({
      n,
    }),
  )
}

export function popToTop(immediate?: boolean) {
  _navigator.dispatch(StackActions.popToTop(immediate ? { immediate } : {}))
}

export function reset(index, actions: any[]) {
  _navigator.dispatch(
    StackActions.reset({
      index,
      key: undefined,
      actions,
    }),
  )
}
// Allows navigation params to override props.
// Check a key in the navigation params ('navigation' in props) for a key, then check the props object itself
export const checkNavThenProps = (key: string, props: any, _default?: any) =>
  props.navigation.getParam(key, props[key] || _default)
export const checkNav = (key: string, props: any, _default?: any) =>
  props.navigation.getParam(key, _default)

export default {
  Routes, // for convenience
  Params, // for convenience
  setTopLevelNavigator,
  onNavigationStateChange,
  navigate,
  goBack,
  push,
  pop,
  popToTop,
  checkNavThenProps,
}
