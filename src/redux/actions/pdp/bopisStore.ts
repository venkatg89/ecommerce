import { CART_ERROR_MODAL } from 'src/constants/formErrors'
import { GlobalModals } from 'src/constants/globalModals'
import { populateStoreDetails } from 'src/endpoints/bopis/stores'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { StoreModel } from 'src/models/StoreModel'
import { State } from 'src/redux/reducers'
import { setformErrorMessagesAction } from '../form/errorsAction'
import { setActiveGlobalModalAction } from '../modals/globalModals'

export const SET_BOPIS_STORE = 'PDP__SET_BOPIS_STORE'
export const setBopisStore = makeActionCreator<StoreModel>(SET_BOPIS_STORE)

export const setBopisStoreAction: (
  store: StoreModel,
) => ThunkedAction<State> = (store) => async (dispatch, getState) => {
  const response = await populateStoreDetails(store.id)
  if (response.ok) {
    dispatch(setBopisStore(store))
  } else {
    if (response.data?.response?.message) {
      await dispatch(
        setformErrorMessagesAction(CART_ERROR_MODAL, [
          {
            formFieldId: 'body',
            error: response.data.response.message,
          },
        ]),
      )
    }
    dispatch(setActiveGlobalModalAction({ id: GlobalModals.CART_ERROR }))
  }
}
