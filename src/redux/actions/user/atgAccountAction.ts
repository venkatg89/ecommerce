import { State } from 'src/redux/reducers'

import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import actionApiCall from 'src/helpers/redux/actionApiCall'
import { ensureNoCallInProgress } from 'src/helpers/redux/checkApiCallState'
import {
  normalizeAtgUserDetails,
  normalizeUserMembership,
} from 'src/helpers/api/atg/normalizeAccount'
import { LoginCredentialStore } from 'src/apis/session/sessions'
import { accountEmailSelector } from 'src/redux/selectors/userSelector'

import {
  getAccountDetails,
  updateAccountDetails,
  addMembership,
  profileRemoveGiftCard,
  profileAddGiftCard,
  updateDefaultAddress,
  editAddresOnProfile,
  deleteAddressFromProfile,
} from 'src/endpoints/atgGateway/accountDetails'
import { ShippingAddress } from 'src/models/ShopModel/CartModel'
import {
  AtgAccountModel,
  UpdateAtgAccountDetailsModel,
  AtgAddMembershipModel,
} from 'src/models/UserModel/AtgAccountModel'
import { setformErrorMessagesAction } from '../form/errorsAction'
import { setAddressDetails } from 'src/redux/actions/shop/cartAction'
import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import { GlobalModals } from 'src/constants/globalModals'
import { ACCOUNT_ERROR_MODAL } from 'src/constants/formErrors'
import {
  emailAddressFailedAction,
  emailAddressFetchingAction,
  emailAddressResetAction,
  emailAddressSuccessAction,
} from './emailAddressAction'
import {
  phoneNumberFailedAction,
  phoneNumberFetchingAction,
  phoneNumberResetAction,
  phoneNumberSuccessAction,
} from './phoneNumberAction'

import { addEventAction, LL_GIFT_REDEEMED } from 'src/redux/actions/localytics'

// Action names
export const atgAccountApiActions = makeApiActions(
  'atgApiAccountActions',
  'USER__ATG_ACCOUNT',
)
export const atgEditAccountApiActions = makeApiActions(
  'atgApiEditAccountActions',
  'USER__ATG_EDIT_ACCOUNT',
)

export const SET_USER_ATG_ACCOUNT = 'MY_USER__ATG_ACCOUNT_SET'
export const SET_USER_MEMBERSHIP = 'SET_USER_MEMBERSHIP'

export const setAtgProfileAction = makeActionCreator<AtgAccountModel>(
  SET_USER_ATG_ACCOUNT,
)
export const setUserMembership = makeActionCreator(SET_USER_MEMBERSHIP)

// In Progress calls checker
const ensureNoOtherCall = (state: State) =>
  ensureNoCallInProgress(atgAccountApiActions.debugName, state.atg.api.account)
const ensureNoOtherEditAccountCall = (state: State) =>
  ensureNoCallInProgress(
    atgEditAccountApiActions.debugName,
    state.atg.api.editAccount,
  )

const getMyAtgIdFrom = (state: State) =>
  state.user.account && state.user.account!.atgUserId

// Api call actions
export const fetchAtgAccountAction: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  const state = getState()
  const atgUserId = getMyAtgIdFrom(state)
  if (atgUserId && ensureNoOtherCall(getState())) {
    const response = await actionApiCall(dispatch, atgAccountApiActions, () =>
      getAccountDetails(atgUserId),
    )
    if (response.ok) {
      const { userDetails } = response.data.response
      const normalizedUserDetails = normalizeAtgUserDetails(userDetails)
      await dispatch(setAtgProfileAction(normalizedUserDetails))
    }
  }
}

export const resetEmailAPIStatus: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  await dispatch(emailAddressResetAction())
}

export const resetPhoneNumberAPIStatus: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  await dispatch(phoneNumberResetAction())
}

export const editAtgAccountDetails: (
  edits: UpdateAtgAccountDetailsModel,
  errorFormId?: string,
) => ThunkedAction<State> = (edits, errorFormId) => async (
  dispatch,
  getState,
) => {
  const state = getState()
  const atgUserId = getMyAtgIdFrom(state)
  if (atgUserId && ensureNoOtherEditAccountCall(getState())) {
    await dispatch(emailAddressFetchingAction())
    await dispatch(phoneNumberFetchingAction())
    const response = await actionApiCall(
      dispatch,
      atgEditAccountApiActions,
      () => updateAccountDetails(atgUserId, edits),
    )
    const apiSuccess =
      (response.ok || response.status === 200) &&
      response.data &&
      response.data.response.success
    if (apiSuccess) {
      const { userDetails } = response.data.response
      const normalizedUserDetails = normalizeAtgUserDetails(userDetails)
      await dispatch(setAtgProfileAction(normalizedUserDetails))
      await dispatch(emailAddressSuccessAction())
      await dispatch(phoneNumberSuccessAction())
      if (edits.password) {
        const newState = getState()
        const username = accountEmailSelector(newState)
        const { password } = edits
        await LoginCredentialStore.set({ username, password })
      }
    }
    if (errorFormId && !apiSuccess) {
      await dispatch(emailAddressFailedAction())
      await dispatch(phoneNumberFailedAction())
      const message =
        response && response.data && response.data.response
          ? response.data.response.message
          : 'An error occured, but no details given.'
      dispatch(
        setformErrorMessagesAction(errorFormId, [
          { formFieldId: 'message', error: message },
        ]),
      )
    }
  }
}

export const addAtgMembership: (
  edits: AtgAddMembershipModel,
  callback: () => void,
) => ThunkedAction<State> = (payload, callback) => async (
  dispatch,
  getState,
) => {
  if (ensureNoOtherCall(getState())) {
    const response = await actionApiCall(dispatch, atgAccountApiActions, () =>
      addMembership(payload),
    )
    if (response.ok) {
      const userDetails = response.data.response
      const membership = normalizeUserMembership(userDetails)
      dispatch(setUserMembership({ membership }))
      callback()
    }
  }
}

export const removeGiftCardFromAccountAction: (
  profileId: string,
  id: string,
) => ThunkedAction<State> = (profileId, id) => async (dispatch, getState) => {
  const response = await profileRemoveGiftCard(profileId, id)
  if (response.data.response.success) {
    const { userDetails } = response.data.response
    const normalizedUserDetails = normalizeAtgUserDetails(userDetails)
    await dispatch(setAtgProfileAction(normalizedUserDetails))
  } else {
    const error = response.data.response
    await dispatch(
      setformErrorMessagesAction('GiftCartForm', [
        { formFieldId: 'GiftCardActionAccount', error: error.message },
      ]),
    )
  }
}

export const addGiftCardToAccountAction: (
  profileId: string,
  mercuryId: string,
  giftCardNumber: string,
  giftCardPin: string,
) => ThunkedAction<State> = (
  profileId,
  mercuryId,
  giftCardNumber,
  giftCardPin,
) => async (dispatch, getState) => {
  const response = await profileAddGiftCard(
    profileId,
    mercuryId,
    giftCardNumber,
    giftCardPin,
  )
  if (response.data.response.success) {
    const { userDetails } = response.data.response
    const normalizedUserDetails = normalizeAtgUserDetails(userDetails)
    await dispatch(setAtgProfileAction(normalizedUserDetails))
    const giftCardRedeemed = {
      giftCardNumber: giftCardNumber,
    }
    await dispatch(addEventAction(LL_GIFT_REDEEMED, giftCardRedeemed))
  } else {
    const error = response.data.response
    await dispatch(
      setformErrorMessagesAction('GiftCartForm', [
        { formFieldId: 'GiftCardActionAccount', error: error.message },
      ]),
    )
  }
}

export const setDefaultAddressAction: (
  profileId: string,
  addressNickName: string,
) => ThunkedAction<State> = (profileId, addressNickName) => async (
  dispatch,
  getState,
) => {
  const response = await updateDefaultAddress({ profileId, addressNickName })
  if (response.data.response.success) {
    const { userDetails } = response.data.response
    await dispatch(setAddressDetails(userDetails.userInfo.addressList))
  }
}

export const editAddressOnProfileAction: (
  address: ShippingAddress,
  profileId: string,
) => ThunkedAction<State> = (
  address: ShippingAddress,
  profileId: string,
) => async (dispatch, getState) => {
  const response = await editAddresOnProfile(profileId, address)
  if (response.ok || response.status === 200) {
    const { userDetails } = response.data.response
    await dispatch(setAddressDetails(userDetails.userInfo.addressList))
  }
}

export const deleteAddressFromProfileAction: (
  addressNickName: string,
  profileId: string,
) => ThunkedAction<State> = (
  addressNickName: string,
  profileId: string,
) => async (dispatch, getState) => {
  const response = await deleteAddressFromProfile(profileId, addressNickName)
  if (response.ok) {
    const { userDetails } = response.data.response
    await dispatch(setAddressDetails(userDetails.userInfo.addressList))
  } else {
    if (response.data && response.data.response.message) {
      await dispatch(
        setformErrorMessagesAction(ACCOUNT_ERROR_MODAL, [
          {
            formFieldId: 'body',
            error: response.data.response.message,
          },
        ]),
      )
      dispatch(setActiveGlobalModalAction({ id: GlobalModals.ACCOUNT_ERROR }))
    }
  }
}
