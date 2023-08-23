import { State } from 'src/redux/reducers'

import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import {
  addGiftCard,
  redeemFromAccount,
  addPromoCode,
  removeGiftCard,
  addBookfairId,
  removeBookfair,
  TaxExempt,
  removePromoCode,
  addMembership,
} from 'src/endpoints/atgGateway/cart'
import { normalizeUserMembership } from 'src/helpers/api/atg/normalizeAccount'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { refreshCartWithNewPriceAction } from '../shop/cartAction'
import {
  addEventAction,
  LL_GIFT_REDEEMED,
  LL_MEMBERSHIP_DETAILS,
} from 'src/redux/actions/localytics'

export const SET_USER_MEMBERSHIP = 'SET_USER_MEMBERSHIP'
export const setUserMembership = makeActionCreator(SET_USER_MEMBERSHIP)

export const addPromoCodeAction: (promoCode: string) => ThunkedAction<State> = (
  promoCode,
) => async (dispatch, getState) => {
  const response = await addPromoCode(promoCode)
  if (response.data.formError === undefined) {
    await dispatch(refreshCartWithNewPriceAction())
  } else {
    const error = response.data.formExceptions[0]
    await dispatch(
      setformErrorMessagesAction('CartDiscountForm', [
        { formFieldId: 'PromotionCode', error: error.localizedMessage },
      ]),
    )
  }
}

export const addMembershipAction: (
  number: string,
  type: string,
  id?: string,
) => ThunkedAction<State> = (number, type, id) => async (
  dispatch,
  getState,
) => {
  const response = await addMembership(number, type, id)
  if (response.data.response.success) {
    const userDetails = response.data.response
    const membership = normalizeUserMembership(userDetails)
    dispatch(setUserMembership({ membership }))
    const membershipDetails = {
      membershipType: type,
      membershipNumber: number,
    }
    await dispatch(addEventAction(LL_MEMBERSHIP_DETAILS, membershipDetails))
  } else {
    const error = response.data.response
    await dispatch(
      setformErrorMessagesAction('CartDiscountForm', [
        { formFieldId: 'MembershipCode', error: error.message },
      ]),
    )
  }
}

export const addGiftCardAction: (
  giftCard: string,
  pin: string,
) => ThunkedAction<State> = (giftCard, pin) => async (dispatch, getState) => {
  const response = await addGiftCard(giftCard, pin)
  if (response.data.formError === undefined) {
    await dispatch(refreshCartWithNewPriceAction())
    const giftCardRedeemed = {
      giftCardNumber: giftCard,
    }
    await dispatch(addEventAction(LL_GIFT_REDEEMED, giftCardRedeemed))
  } else {
    const error = response.data.formExceptions[0]
    await dispatch(
      setformErrorMessagesAction('CartDiscountForm', [
        { formFieldId: 'GiftCardCode', error: error.localizedMessage },
      ]),
    )
  }
}

export const redeemCardFromAccountAction: (
  index: string,
) => ThunkedAction<State> = (index) => async (dispatch, getState) => {
  const response = await redeemFromAccount(index)
  if (response.data.formError === undefined) {
    await dispatch(refreshCartWithNewPriceAction())
  } else {
    const error = response.data.formExceptions[0]
    await dispatch(
      setformErrorMessagesAction('CartDiscountForm', [
        { formFieldId: 'GiftCardCode', error: error.localizedMessage },
      ]),
    )
  }
}

export const TaxExemptAction: (taxExempt) => ThunkedAction<State> = (
  taxExempt,
) => async (dispatch, getState) => {
  taxExempt = taxExempt + ''
  const response = await TaxExempt(taxExempt)
  if (response.data.formError === undefined) {
    await dispatch(refreshCartWithNewPriceAction())
  } else {
    const error = response.data.formExceptions[0]
    await dispatch(
      setformErrorMessagesAction('CartDiscountForm', [
        { formFieldId: 'BookfairId', error: error.localizedMessage },
      ]),
    )
  }
}

export const removeGiftCardAction: (paymentId) => ThunkedAction<State> = (
  paymentId,
) => async (dispatch, getState) => {
  const response = await removeGiftCard(paymentId)
  if (response.data.formError === undefined) {
    await dispatch(refreshCartWithNewPriceAction())
  } else {
    const error = response.data.formExceptions[0]
    await dispatch(
      setformErrorMessagesAction('CartDiscountForm', [
        { formFieldId: 'GiftCardCode', error: error.localizedMessage },
      ]),
    )
  }
}

export const removeBookfairIdAction: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  const response = await removeBookfair()
  if (response.data.formError === undefined) {
    await dispatch(refreshCartWithNewPriceAction())
  } else {
    const error = response.data.formExceptions[0]
    await dispatch(
      setformErrorMessagesAction('CartDiscountForm', [
        { formFieldId: 'BookfairId', error: error.localizedMessage },
      ]),
    )
  }
}

export const removePromoCodeAction: (promoCode) => ThunkedAction<State> = (
  promoCode,
) => async (dispatch, getState) => {
  const response = await removePromoCode(promoCode)
  if (response.data.formError === undefined) {
    await dispatch(refreshCartWithNewPriceAction())
  } else {
    const error = response.data.formExceptions[0]
    await dispatch(
      setformErrorMessagesAction('CartDiscountForm', [
        { formFieldId: 'PromotionCode', error: error.localizedMessage },
      ]),
    )
  }
}

export const addBookfairIdAction: (
  bookfairId: string,
) => ThunkedAction<State> = (bookfairId) => async (dispatch, getState) => {
  const response = await addBookfairId(bookfairId)
  if (response.data.formError === undefined) {
    await dispatch(refreshCartWithNewPriceAction())
  } else {
    const error = response.data.formExceptions[0]
    await dispatch(
      setformErrorMessagesAction('CartDiscountForm', [
        { formFieldId: 'BookfairId', error: error.localizedMessage },
      ]),
    )
  }
}
