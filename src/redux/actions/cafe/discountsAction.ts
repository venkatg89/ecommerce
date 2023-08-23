import { State } from 'src/redux/reducers'
import { speedetabAddPromoCode, speedetabRemovePromoCode } from 'src/endpoints/speedetab/discounts'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { updateCartAction } from 'src/redux/actions/cafe/cartAction'

export const addPromoCodeAction: (promoCode: string) => ThunkedAction<State> =
  promoCode => async (dispatch, getState) => {
    const response = await speedetabAddPromoCode({ promoCode })
    if (response.ok) {
      await dispatch(updateCartAction())
    } else {
      const error = response.error.errors[0]
      await dispatch(setformErrorMessagesAction('CafeDiscountForm', [{ formFieldId: 'PromotionCode', error: error.message }]))
    }
  }

export const removePromoCodeAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const response = await speedetabRemovePromoCode()
    if (response.ok) {
      await dispatch(updateCartAction())
    }
  }
