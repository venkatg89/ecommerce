import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { checkInUser, checkOutUser, getCurrentCheckedIn } from 'src/endpoints/speedetab/checkIn'
import { getCafeVenueByExternalId, normalizeCafeSearchVenueResultsResponseData } from 'src/endpoints/speedetab/venues'
import { CAFE_ERROR_MODAL } from 'src/constants/formErrors'
import { GlobalModals } from 'src/constants/globalModals'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import { fetchCafeVenueAction, setCafeSearchCafeVenueResults } from 'src/redux/actions/cafe/venuesAction'

export const CHECK_IN_CAFE_USER_VENUE = 'CAFE__USER_VENUE_CHECK_IN'
const checkInCafeUserVenue = makeActionCreator(CHECK_IN_CAFE_USER_VENUE)
export const CHECK_OUT_CAFE_USER_VENUE = 'CAFE__USER_VENUE_CHECK_OUT'
const checkOutCafeUserVenue = makeActionCreator(CHECK_OUT_CAFE_USER_VENUE)

const _checkOutUser: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    await checkOutUser()
    await dispatch(checkOutCafeUserVenue())
  }

const _checkInUser: (venueId: string) => ThunkedAction<State, boolean> =
  venueId => async (dispatch, getState) => {
    await dispatch(_checkOutUser())

    const response = await checkInUser(venueId)
    if (response.ok) {
      await dispatch(fetchCafeVenueAction(venueId))
      await dispatch(checkInCafeUserVenue({ venueId }))
      return true
    }
    if (response.data.errors && response.data.errors.venue) {
      await dispatch(setformErrorMessagesAction(CAFE_ERROR_MODAL, [{ formFieldId: 'body', error: `Selected cafe store currently ${response.data.errors.venue}, please try a different location.` }]))
    } else if (response.data.errors && response.data.errors.base) {
      await dispatch(setformErrorMessagesAction(CAFE_ERROR_MODAL, [{ formFieldId: 'body', error: response.data.errors.base }]))
    }
    dispatch(setActiveGlobalModalAction({ id: GlobalModals.CAFE_ERROR }))
    return false
  }

export const checkInVenueAction: (venueId: string) => ThunkedAction<State, boolean> =
  venueId => async (dispatch, getState) => {
    const getCurrentCheckedInResponse = await getCurrentCheckedIn()
    const currentlyCheckedInVenueId = getCurrentCheckedInResponse.ok
      && getCurrentCheckedInResponse.data.check_in.venue
      && getCurrentCheckedInResponse.data.check_in.venue.id

    if (currentlyCheckedInVenueId && currentlyCheckedInVenueId === venueId) {
      // already checked in
      await Promise.all([
        dispatch(fetchCafeVenueAction(currentlyCheckedInVenueId)),
        // dispatch(updateCartAction()),
      ])
      await dispatch(checkInCafeUserVenue({ venueId: currentlyCheckedInVenueId }))
      return true
    } else if (currentlyCheckedInVenueId && currentlyCheckedInVenueId !== venueId) { // eslint-disable-line
      // if checked in, but in a different venue, checkout out of current and check in to selected
      // await dispatch(_checkOutUser())
      const checkedIn = await dispatch(_checkInUser(venueId))
      return checkedIn
    }
    // if not checked in, check in
    // await dispatch(_checkOutUser())
    const checkedIn = await dispatch(_checkInUser(venueId))
    return checkedIn
  }

const checkInVenueWithBnStoreId: (storeId: string) => ThunkedAction<State, boolean> =
  storeId => async (dispatch, getState) => {
    const response = await getCafeVenueByExternalId({ externalVenueId: storeId })
    if (response.ok) {
      const results = normalizeCafeSearchVenueResultsResponseData(response.data)
      const { venueIds } = results
      if (venueIds[0]) {
        await dispatch(setCafeSearchCafeVenueResults(results))
        // get first venue
        const checkedIn = await dispatch(checkInVenueAction(venueIds[0]))
        return checkedIn
      }
    }
    await dispatch(setformErrorMessagesAction(CAFE_ERROR_MODAL, [{
      formFieldId: 'body', error: 'There was an issue trying to find a cafe at this store, please select a different location',
    }]))
    dispatch(setActiveGlobalModalAction({ id: GlobalModals.CAFE_ERROR }))
    return false
  }

// const checkInFavoriteStore: () => ThunkedAction<State> =
//   () => async (dispatch, getState) => {
//     const favStoreId = favoriteStoreIdSelector(getState())
//     if (!storeSelector(getState(), { storeId: favStoreId })) {
//       await dispatch(fetchStoreDetailsAction(favStoreId))
//     }
//     const store = storeSelector(getState(), { storeId: favStoreId })
//     if (store && store.hasCafe) {
//       dispatch(checkInVenueWithBnStoreId(store.id))
//     }
//   }

export interface CheckInUserStoreActionParams {
  storeId?: string; // this is bn store specific
  venueId?: string; // this is cafe specific
}

export const checkInUserStoreAction: (params?: CheckInUserStoreActionParams) => ThunkedAction<State, boolean> =
  params => async (dispatch, getState) => {
    if (params && params.storeId) {
      await dispatch(_checkOutUser())
      const checkedIn = await dispatch(checkInVenueWithBnStoreId(params.storeId))
      return checkedIn
    }
    if (params && params.venueId) {
      const checkedIn = await dispatch(checkInVenueAction(params.venueId))
      return checkedIn
    }
    const response = await getCurrentCheckedIn()
    if (response.ok) {
      const _venueId = response.data.check_in.venue.id
      const checkedIn = await dispatch(checkInVenueAction(_venueId))
      return checkedIn
    }
    return false
  }
