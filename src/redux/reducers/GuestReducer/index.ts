import { Reducer } from 'redux'
import {
  SET_GUEST_EMAIL,
  UPDATED_GUEST_EMAIL,
} from 'src/redux/actions/guestInfo/guestInfoAction'

export interface GuestInfoState {
  email: string
  emailNeedsUpdate: boolean
}

const DEFAULT: GuestInfoState = {
  email: '',
  emailNeedsUpdate: false,
}

const guestInfo: Reducer<GuestInfoState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_GUEST_EMAIL:
      return {
        ...state,
        email: action.payload,
        emailNeedsUpdate: true,
      }
    case UPDATED_GUEST_EMAIL:
      return { ...state, emailNeedsUpdate: action.payload }
    default:
      return state
  }
}

export default guestInfo
