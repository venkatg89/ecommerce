import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { State } from 'src/redux/reducers'

import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { ShopDeliverySpeedModel, ShopDeliveryOptionsModel } from 'src/models/ShopModel/DeliveryOptionsModel'
import {
  getDeliveryOptions, setCartItemShippingMethod,
  setBopisTextNotification, removeBopisTextNotification, setBopisProxy,
} from 'src/endpoints/atgGateway/cart'
import { refreshCartWithNewPriceAction, refreshCart, parseCartFromResponse } from 'src/redux/actions/shop/cartAction'

const parseCartDeliveryOptionFromResponse = (data) => {
  return data.response.deliverySpeedList.reduce((obj, shippingGroup) => {
    const id = shippingGroup.originalSGId
    const deliverySpeed = shippingGroup.deliverySpeed.map((_deliverySpeed): ShopDeliverySpeedModel => ({
      shippingMethodId: _deliverySpeed.id,
      deliveryPromise: _deliverySpeed.deliveryPromise.replace(/:/g,'').trim(),
      displayName: _deliverySpeed.displayName,
      shippingPrice: _deliverySpeed.shippingPrice,
    }))

    // sometimes the api returns duplicate delivery speeds
    let ids = deliverySpeed.map(delievery => delievery.shippingMethodId)
    let filtered = deliverySpeed.filter(({ shippingMethodId }, index) => !ids.includes(shippingMethodId, index + 1))

    obj[id] = filtered
    return obj
  }, {})
}

export const GET_CART_DELIVERY_OPTIONS = 'CART--GET_DELIVERY_OPTIONS'
const cartDeliveryOptions = makeActionCreator<ShopDeliveryOptionsModel>(GET_CART_DELIVERY_OPTIONS)

export const getCartDeliveryOptionsAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
  const response = await getDeliveryOptions()

  if (response.ok) {
    const deliveryOptions = await parseCartDeliveryOptionFromResponse(response.data)
    await dispatch(cartDeliveryOptions(deliveryOptions))
  }
}

export interface SetCartItemShippingMethodParams {
  shippingMethodId: string
  shippingGroupId: string
}

export const setCartItemShippingMethodAction: (params: SetCartItemShippingMethodParams) => ThunkedAction<State, boolean> =
  ({ shippingMethodId, shippingGroupId }) => async (dispatch, getState) => {
  const response = await setCartItemShippingMethod({ shippingMethodId, shippingGroupId })
  if (response.ok) {
    await dispatch(refreshCartWithNewPriceAction())
    return true
  }
  return false
}

export const setBopisTextNotificationAction: (phoneNumber?: string) => ThunkedAction<State, boolean> =
  (phoneNumber) => async (dispatch, getState) => {
    const state = getState()

    // check for bopis, if no bopis return true
    const hasBopis = state.shop.cart.shippingGroups.map(shippingGroup => shippingGroup.shippingGroupType).includes('bopisHardgoodShippingGroup')
    if (!hasBopis) { return true }

    if (phoneNumber) {
      const response = await setBopisTextNotification(phoneNumber)
      if (response.ok) {
        const cart = await parseCartFromResponse(response)
        await dispatch(refreshCart({ cart: cart }))
      } else {
        const message = response.data.response.message
        await dispatch(setformErrorMessagesAction('CartCheckout-BOPIS-TextNotification', [{ formFieldId: 'phoneNumber', error: message }]))
        return false
      }
    } else {
      const state: State = getState()
      const shippingGroup = state.shop.cart.shippingGroups.find(shippingGroup => shippingGroup.shippingGroupType === 'bopisHardgoodShippingGroup')

      if (shippingGroup && shippingGroup.textNotificationPhoneNumber) { // if there is a phone number we remove it, otherwise ignore
        const response = await removeBopisTextNotification(shippingGroup.id)
        if (response.ok) {
          const cart = await parseCartFromResponse(response)
          await dispatch(refreshCart({ cart: cart }))
        } else {
          // TODO: error modal
          return false
        }
      }
    }
    return true // success
  }

export interface SetBopisProxyParams {
  name?: string
  email?: string
  phoneNumber?: string
  proxyPickUp: boolean
}

export const setBopisProxyAction: (params: SetBopisProxyParams) => ThunkedAction<State, boolean> =
  ({ name, email, phoneNumber, proxyPickUp }) => async (dispatch, getState) => {
    const state = getState()

    // check for bopis, if no bopis return true
    const hasBopis = state.shop.cart.shippingGroups.map(shippingGroup => shippingGroup.shippingGroupType).includes('bopisHardgoodShippingGroup')
    if (!hasBopis) { return true }

    if (proxyPickUp) {
      const response = await setBopisProxy({ name, email, phoneNumber, proxyPickUp })
      if (response.ok) {
        const cart = await parseCartFromResponse(response)
        await dispatch(refreshCart({ cart: cart }))
      } else {
        const message = response.data.response.message
        if (message.includes('name')) {
          await dispatch(setformErrorMessagesAction('CartCheckout-BOPIS-ProxyDetails', [{ formFieldId: 'proxyName', error: message }]))
        }
        if (message.includes('email')) {
          await dispatch(setformErrorMessagesAction('CartCheckout-BOPIS-ProxyDetails', [{ formFieldId: 'proxyEmail', error: message }]))
        }
        if (message.includes('phone')) {
          await dispatch(setformErrorMessagesAction('CartCheckout-BOPIS-ProxyDetails', [{ formFieldId: 'proxyPhoneNumber', error: message }]))
        }
        return false
      }
    } else {
      const response = await setBopisProxy({ proxyPickUp }) // remove
      if (response.ok) {
        const cart = await parseCartFromResponse(response)
        await dispatch(refreshCart({ cart: cart }))
      } else {
        // TODO: error modal
        return false
      }
    }
    return true // success
  }
