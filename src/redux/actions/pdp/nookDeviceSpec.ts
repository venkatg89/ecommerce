import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { fetchNookDeviceSpecifications } from 'src/endpoints/atgGateway/pdp/nookDeviceSpec'

export const SET_NOOK_DEVICE_SPEC = 'SET_NOOK_DEVICE_SPEC'
export const setNookDeviceSpecifications = makeActionCreator<string[]>(
  SET_NOOK_DEVICE_SPEC,
)

export const getNookDeviceSpecificationsAction: (
  ean?: string,
) => ThunkedAction<State> = (ean) => async (dispatch, getState) => {
  const response = await fetchNookDeviceSpecifications(ean)

  if (response.ok) {
    if (response.data.response.cqContent) {
      dispatch(setNookDeviceSpecifications(response.data.response.cqContent))
    }
  }
}
