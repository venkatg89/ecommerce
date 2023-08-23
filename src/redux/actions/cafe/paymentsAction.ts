import { State } from 'src/redux/reducers'

import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import { paymentCardNormalizer } from 'src/helpers/api/cafe/paymentCardNormalizer'
import { paymentCardNetwork } from 'src/helpers/paymentCard'

import {
  getSpreedlyEnvironmentKey,
  tokenizePaymentCard,
  addPaymentCard,
  getPaymentCards,
  normalizeGetPaymentCardsResponseData,
  speedetabDeletePaymentCard,
} from 'src/endpoints/speedetab/payments'

import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { accountEmailSelector } from 'src/redux/selectors/userSelector'

interface CardIdProps {
  cardId: string
}

export const SET_PREFERED_PAYMENT_CARD = 'PAYMENT__PREFERED_CARD_SET'
export const setPreferedPaymentCardAction = makeActionCreator<CardIdProps>(
  SET_PREFERED_PAYMENT_CARD,
)

export const ADD_TEMP_PAYMENT_CARD = 'CAFE_PAYMENT__ADD_TEMP_CARD'
const addTempPaymentCard = makeActionCreator(ADD_TEMP_PAYMENT_CARD)

export const DELETE_TEMP_PAYMENT_CARD = 'CAFE_PAYMENT__DELETE_TEMP_CARD'
export const deleteTempPaymentCardAction = makeActionCreator(
  DELETE_TEMP_PAYMENT_CARD,
)

export const ADD_NEW_PAYMENT_CARD = 'CAFE_PAYMENT__NEW_CARD_ADD'
const addNewPaymentCard = makeActionCreator(ADD_NEW_PAYMENT_CARD)

export const addNewPaymentApiActions = makeApiActions(
  'paymentAddNewCard',
  'CAFE_PAYMENT__NEW_CARD_ADD',
)

export interface AddPaymentCardActionParams {
  nickname: string
  name: string
  cardNumber: string
  cardCvc: string
  month: string
  year: string
}

export const addTempPaymentCardAction: (
  params: AddPaymentCardActionParams,
) => ThunkedAction<State, boolean> = ({
  nickname,
  name,
  cardNumber,
  cardCvc,
  month,
  year,
}) => async (dispatch, getState) => {
  try {
    await dispatch(addNewPaymentApiActions.actions.inProgress)

    /* https://developer.speedetab.com/docs/managing-payment-methods */
    const spreedlyEnvKeyResponse = await getSpreedlyEnvironmentKey()
    const environmentKey =
      spreedlyEnvKeyResponse.data.data.spreedly_environment_key

    const tokenizePaymentCardResponse = await tokenizePaymentCard({
      environmentKey,
      email: accountEmailSelector(getState()),
      name,
      cardNumber,
      cardCvc,
      month,
      year,
    })

    if (tokenizePaymentCardResponse.ok) {
      const paymentCardToken =
        tokenizePaymentCardResponse.data.transaction.payment_method.token
      const cardId = paymentCardToken
      const card = paymentCardNormalizer({
        uuid: cardId,
        token: paymentCardToken,
        last_four: cardNumber.substr(cardNumber.length - 4),
        expiration_date: `${year}-${month}-01`,
        display_name: name,
        card_type: paymentCardNetwork(cardNumber),
      })
      await dispatch(addTempPaymentCard({ cardId, card }))
      await dispatch(setPreferedPaymentCardAction({ cardId }))
      await dispatch(addNewPaymentApiActions.actions.success)
      return true
    } else {
      const errorMessages = tokenizePaymentCardResponse.error.errors.map(
        (error) => ({
          formFieldId: error.attribute,
          error: error.message,
        }),
      )
      await dispatch(addNewPaymentApiActions.actions.failed)
      await dispatch(
        setformErrorMessagesAction('CafeAddPaymentCard', errorMessages),
      )
    }
  } catch {
    await dispatch(addNewPaymentApiActions.actions.failed)
    return false
  }
  await dispatch(addNewPaymentApiActions.actions.failed)
  return false
}

export const addPaymentCardAction: (
  params: AddPaymentCardActionParams,
) => ThunkedAction<State, boolean> = ({
  nickname,
  name,
  cardNumber,
  cardCvc,
  month,
  year,
}) => async (dispatch, getState) => {
  try {
    await dispatch(addNewPaymentApiActions.actions.inProgress)

    /* https://developer.speedetab.com/docs/managing-payment-methods */
    const spreedlyEnvKeyResponse = await getSpreedlyEnvironmentKey()
    const environmentKey =
      spreedlyEnvKeyResponse.data.data.spreedly_environment_key

    const tokenizePaymentCardResponse = await tokenizePaymentCard({
      environmentKey,
      email: accountEmailSelector(getState()),
      name,
      cardNumber,
      cardCvc,
      month,
      year,
    })

    if (tokenizePaymentCardResponse.ok) {
      const paymentCardToken =
        tokenizePaymentCardResponse.data.transaction.payment_method.token

      const addPaymentResponse = await addPaymentCard({
        nickname,
        token: paymentCardToken,
      })

      if (addPaymentResponse.ok) {
        const cardId = addPaymentResponse.data.data.uuid
        const card = paymentCardNormalizer(addPaymentResponse.data.data)
        await dispatch(addNewPaymentCard({ cardId, card }))
        await dispatch(setPreferedPaymentCardAction({ cardId }))
        await dispatch(addNewPaymentApiActions.actions.success)
        return true
      }
    } else {
      const errorMessages = tokenizePaymentCardResponse.error.errors.map(
        (error) => ({
          formFieldId: error.attribute,
          error: error.message,
        }),
      )
      await dispatch(addNewPaymentApiActions.actions.failed)
      await dispatch(
        setformErrorMessagesAction('CafeAddPaymentCard', errorMessages),
      )
    }
  } catch {
    await dispatch(addNewPaymentApiActions.actions.failed)
    return false
  }
  await dispatch(addNewPaymentApiActions.actions.failed)
  return false
}

export const DELETE_PAYMENT_CARD = 'PAYMENT__CARD_REMOVE'
const deletePaymentCard = makeActionCreator<CardIdProps>(DELETE_PAYMENT_CARD)

export const deletePaymentCardsAction: (
  params: CardIdProps,
) => ThunkedAction<State> = ({ cardId }) => async (dispatch, getState) => {
  const response = await speedetabDeletePaymentCard({ cardId })

  if (response.ok) {
    await dispatch(deletePaymentCard({ cardId }))
  }
}

export const SET_PAYMENT_CARDS = 'PAYMENT__CARDS_SET'
const setPaymentCards = makeActionCreator(SET_PAYMENT_CARDS)

export const fetchPaymentCardsAction: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  const response = await getPaymentCards()

  if (response.ok) {
    const state = getState()
    const cards = {
      ...normalizeGetPaymentCardsResponseData(response.data),
      ...state.cafe.payment.tempPaymentCard,
    }
    await dispatch(setPaymentCards({ cards }))
  }
}
