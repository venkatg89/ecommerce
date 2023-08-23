import { Reducer } from 'redux'

import { SET_NOOK_DEVICE_SPEC } from 'src/redux/actions/pdp/nookDeviceSpec'

export type NookDeviceSpecificationsState = string

const DEFAULT: NookDeviceSpecificationsState = ''

const nookDeviceSpecifications: Reducer<NookDeviceSpecificationsState> = (
  state = DEFAULT,
  action,
) => {
  switch (action.type) {
    case SET_NOOK_DEVICE_SPEC: {
      return action.payload
    }

    default:
      return state
  }
}

export default nookDeviceSpecifications
