import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { State } from 'src/redux/reducers'

export const SET_GUEST_EMAIL = 'GUEST_EMAIL'
const setGuestEmail = makeActionCreator(SET_GUEST_EMAIL)

export const setGuestEmailAction: (email: string) => ThunkedAction<State> = (
  email,
) => async (dispatch, getState) => {
  dispatch(setGuestEmail(email.toLowerCase()))
}

export const UPDATED_GUEST_EMAIL = 'GUEST_EMAIL_NEEDS_UPDATE'
const updatedGuestEmail = makeActionCreator(UPDATED_GUEST_EMAIL)

export const setGuestEmailNeedsUpdate: (
  needsUpdate: boolean,
) => ThunkedAction<State> = (needsUpdate) => async (dispatch, getState) => {
  dispatch(updatedGuestEmail(needsUpdate))
}
