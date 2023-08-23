import { State } from 'src/redux/reducers'
import { fetchSetMembershipNumber } from 'src/endpoints/speedetab/profile'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { CAFE_ERROR_MODAL } from 'src/constants/formErrors'
import { GlobalModals } from 'src/constants/globalModals'
import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import { fetchCartAction } from 'src/redux/actions/cafe/cartAction'

interface SetMembershipNumberParams {
  bnMembershipNumber: string
  phoneNumber: string
}

export const setMembershipNumberAction: (params: SetMembershipNumberParams) => ThunkedAction<State, boolean> =
  ({ bnMembershipNumber, phoneNumber }) => async (dispatch, getState) => {
    const response = await fetchSetMembershipNumber({ bnMembershipNumber, phoneNumber })
    if (response.ok) {
      await dispatch(fetchCartAction())
      return true
    } else {
      const error = response.error.errors?.phone_verification_required?.[0]
        || response.error.errors?.bn_member_number?.[0]
        || 'Account Cannot Be Linked. Please call Customer Service at 1-866-238-READ (7323)'
      await dispatch(setformErrorMessagesAction(CAFE_ERROR_MODAL, [
        { formFieldId: 'body', error }
      ]))
      dispatch(setActiveGlobalModalAction({ id: GlobalModals.CAFE_ERROR }))
      return false
    }
  }
