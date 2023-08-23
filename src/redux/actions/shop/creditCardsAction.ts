import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { accountEmailSelector } from 'src/redux/selectors/userSelector'

import {
  getCreditCardList,
  setCCAsDefault,
  removeCCFromProfile,
  addBillingAndCard,
  addCardOnProfile,
} from 'src/endpoints/atgGateway/cart'
import { refreshCart } from './cartAction'

export const GET_CREDIT_CARDS_LIST = 'GET_CREDIT_CARDS_LIST'

const getCreditCards = makeActionCreator(GET_CREDIT_CARDS_LIST)

export const getCreditCardsAction: (params: {
  atgUserId: string
}) => ThunkedAction<State> = (params) => async (dispatch, getState) => {
  if (!params.atgUserId) { return }
  const response = await getCreditCardList(params)
  if (response.ok || response.status === 200) {
    await dispatch(getCreditCards(response.data.response.creditCardList))
  }
}

export const addCCAction: (params) => object = (params) => async (
  dispatch,
  getState,
) => {
  params.email = accountEmailSelector(getState())
  const response = await addBillingAndCard(params)
  if (response.ok || response.status === 200) {
    if (!getState().user.account) {
      //guest mode
      await dispatch(refreshCart)
    } else {
      const response = await getCreditCardList(params)
      if (response.ok || response.status === 200) {
        await dispatch(getCreditCards(response.data.response.creditCardList))
      }
    }
  }
  return response
}

export const addMyCCAction: (params) => object = (params) => async (
  dispatch,
  getState,
) => {
  params.email = accountEmailSelector(getState())
  const response = await addCardOnProfile(params)
  if (response.ok || response.status === 200) {
    const response = await getCreditCardList(params)
    if (response.ok || response.status === 200) {
      await dispatch(getCreditCards(response.data.response.creditCardList))
    }
  }
  return response
}

export const setCCAsDefaultAction: (params: {
  atgUserId: string
  creditCardNickName: string
}) => ThunkedAction<State> = (params) => async (dispatch, getState) => {
  const response = await setCCAsDefault(params)
  if (response.ok || response.status === 200) {
    const listResponse = await getCreditCardList(params)
    if (listResponse.ok || listResponse.status === 200) {
      await dispatch(getCreditCards(listResponse.data.response.creditCardList))
    }
  }
}

export const removeCCAction: (params: {
  atgUserId: string
  creditCardNickName: string
}) => object = (params) => async (dispatch, getState) => {
  const response = await removeCCFromProfile(params)
  if (response.ok || response.status === 200) {
    const response = await getCreditCardList(params)
    if (response.ok || response.status === 200) {
      await dispatch(getCreditCards(response.data.response.creditCardList))
    }
  }
  return response
}
