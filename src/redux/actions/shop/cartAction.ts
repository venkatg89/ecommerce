import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import htmlToText from 'src/helpers/ui/htmlToText'
import { shopCartSelector } from 'src/redux/selectors/shopSelector'
import { _ } from 'lodash'
import {
  getOrderDetails,
  repriceOrderDetails,
  updateQuantity,
  markOrRemoveProductAsGift,
  removeItems,
  setDeliveryMethod,
  setPickupStore,
  addAddress,
  editShippingAddress,
  selectShippingAddress,
  checkout,
  fetchOrderSummary,
  fetchUpdateCartGiftCardBalance,
} from 'src/endpoints/atgGateway/cart'
import {
  ShopCartItemModel,
  ShopPromoCodeModel,
  ShopBookfairModel,
  PriceInfo,
  ShopCartModel,
  ShopCartShippingRelationshipModel,
  ShopCartShippingGroupsModel,
  ShopDiscountsModel,
  ShopTaxExemptModel,
  ShippingAddress,
  VerifyAddressRequest,
  SelectShippingAddressRequest,
} from 'src/models/ShopModel/CartModel'
import { getBooksDetails } from 'src/endpoints/atgGateway/pdp/booksDetails'
import { setformErrorMessagesAction } from '../form/errorsAction'
import { CART_ERROR_MODAL } from 'src/constants/formErrors'
import { setActiveGlobalModalAction } from '../modals/globalModals'
import { GlobalModals } from 'src/constants/globalModals'
import {
  addAddressToProfile,
  getAddressDetails,
  getAllCountries,
  getAllStates,
  updateDefaultAddress,
  verifyAddress,
} from 'src/endpoints/atgGateway/accountDetails'
import { ShopOrderSummaryModel } from 'src/models/ShopModel/CheckoutModel'
import {
  makeRequestKeyFromActions,
  cancelApiRequestFromActions,
} from 'src/helpers/redux/cancelTokenSources'
import { isDigital } from 'src/constants/skutypes'
import {
  addItemToSaveForLaterListAction,
  getSaveForLaterListAction,
} from '../saveForLaterList/saveForLaterAction'
import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'
import {
  addEventAction,
  LL_GIFT_OPTIONS_SAVED,
  LL_REMOVE_FROM_CART,
} from 'src/redux/actions/localytics'

export const SET_CART_ITEM_COUNT = 'CART__ITEM_COUNT_SET'
export const setCartItemCountAction = makeActionCreator<number>(SET_CART_ITEM_COUNT)

export interface ModifyCartParams {
  id: string
  modifier: number
}

export interface SafeRemoveItemParams {
  id: string
  remove: boolean
}

const MAX_CART_QUANTITY = 999999
const UNDO_WINDOW_DURATION = 5

export const CheckoutAction: () => ThunkedAction<State, boolean> = () => async (
  dispatch,
  getState,
) => {
  const state: State = getState()
  const cart: ShopCartModel = shopCartSelector(state)
  const filteredCart = cart.items.filter((item) => item.isSafeDeleted === false)
  const processedCart = filteredCart.reduce(
    (previous, current) => ({
      ...previous,
      [current.ean]: current.quantity,
    }),
    {},
  )

  const response = await checkout(processedCart)

  if (response.data && response.ok) {
    const newCart = await parseCartFromResponse(response, cart.shippingMessage)
    await dispatch(refreshCart({ cart: newCart }))

    return true
  } else {
    if (response.data && response.data.formError) {
      await dispatch(
        setformErrorMessagesAction(CART_ERROR_MODAL, [
          {
            formFieldId: 'body',
            error: response.data.formExceptions[0].localizedMessage,
          },
        ]),
      )
      dispatch(setActiveGlobalModalAction({ id: GlobalModals.CART_ERROR }))
    } else {
      dispatch(setActiveGlobalModalAction({ id: GlobalModals.CART_ERROR }))
    }
    return false
  }
}

export const E_COMMERCE_MODIFY_SHOP_CART = 'E_COMMERCE__MODIFY_SHOP_CART'

export const ModifyCartAction: (
  params: ModifyCartParams,
) => ThunkedAction<State> = (params) => async (dispatch, getState) => {
  const state: State = getState()
  const cart: ShopCartModel = shopCartSelector(state)

  const itemToModify: ShopCartItemModel | undefined = cart.items.find(
    (item) => item.id === params.id,
  )
  if (!itemToModify) {
    return
  }
  const previousQuantity = itemToModify?.quantity
  const newQuantity = Math.min(
    Math.max(0, previousQuantity + params.modifier),
    MAX_CART_QUANTITY,
  )
  const response = await updateQuantity(itemToModify.id, false, newQuantity)
  if (response.ok && response.data) {
    await dispatch(refreshCartWithNewPriceAction())
  } else {
    if (response.data.formError) {
      await dispatch(
        setformErrorMessagesAction(CART_ERROR_MODAL, [
          {
            formFieldId: 'body',
            error: response.data.formExceptions[0].localizedMessage,
          },
        ]),
      )
    }
    dispatch(setActiveGlobalModalAction({ id: GlobalModals.CART_ERROR }))
  }
}

export const E_COMMERCE_SAFE_REMOVE_ITEM = 'E_COMMERCE__SAVE_REMOVE_ITEM'
const safeRemoveItem = makeActionCreator(E_COMMERCE_SAFE_REMOVE_ITEM)

export const SafeRemoveItemAction: (
  params: SafeRemoveItemParams,
) => ThunkedAction<State> = (params: SafeRemoveItemParams) => async (
  dispatch,
  getState,
) => {
  await dispatch(safeRemoveItem(params))
  if (params.remove) {
    HardRemoveItemAction(params.id)(dispatch, getState)
  }
}

export const HardRemoveItemAction: (id: string) => ThunkedAction<State> = (
  id: string,
) => async (dispatch, getState) => {
  setTimeout(async function () {
    const currentItemState = shopCartSelector(getState()).items.find(
      (item) => item.id === id,
    )

    if (currentItemState?.isSafeDeleted) {
      const removeResponse = await removeItems([id])
      if (removeResponse.data.formError) {
        await dispatch(
          setformErrorMessagesAction(CART_ERROR_MODAL, [
            {
              formFieldId: 'body',
              error: removeResponse.data.formExceptions[0].localizedMessage,
            },
          ]),
        )
        dispatch(setActiveGlobalModalAction({ id: GlobalModals.CART_ERROR }))
      }
      await dispatch(refreshCartWithNewPriceAction())
      const removeCart = {
        productFormat: currentItemState.parentFormat,
        productTitle: currentItemState.displayName,
        productID: currentItemState.ean,
        price: currentItemState.salePrice,
      }
      dispatch(addEventAction(LL_REMOVE_FROM_CART, removeCart))
    }
  }, UNDO_WINDOW_DURATION * 1000)
}

export const SET_ITEM_PICKUP_STORE = 'SET_ITEM_PICKUP_STORE'
export const SET_ITEM_SHIPPING_STATUS = 'SET_ITEM_SHIPPING_STATUS'

export interface StorePickupParams {
  itemId: string
  store: object
}

export const setItemPickupStoreAction: (
  params: StorePickupParams,
) => ThunkedAction<State> = (params: StorePickupParams) => async (
  dispatch,
  getState,
) => {
  const state: State = getState()
  const cart: ShopCartModel = shopCartSelector(state)

  const hasItemsForPickUp = cart.items.some((item) => item.shipItem === false)

  if (!hasItemsForPickUp) {
    const response = await setDeliveryMethod({
      itemId: params.itemId,
      status: false,
    })
    if (!response.ok) {
      dispatch(setActiveGlobalModalAction({ id: GlobalModals.CART_ERROR }))
      await dispatch(
        setformErrorMessagesAction(CART_ERROR_MODAL, [
          {
            formFieldId: 'body',
            error: response.data.response?.message,
          },
        ]),
      )
      return
    }
  }

  //make API call
  const response = await setPickupStore(params)
  if (response.data.order.errorMessage) {
    await dispatch(
      setformErrorMessagesAction(CART_ERROR_MODAL, [
        {
          formFieldId: 'body',
          error: response.data.order.errorMessage,
        },
      ]),
    )
    dispatch(setActiveGlobalModalAction({ id: GlobalModals.CART_ERROR }))
  } else {
    //update redux
    const cart = await parseCartFromResponse(response)
    await dispatch(dispatch(refreshCart({ cart: cart })))
  }
}

export interface RefreshCartParams {
  id: string
  newAmount: number
}

export const parseCartFromResponse = async (response, shippingMessage?) => {
  const shippingPromotionMessage = shippingMessage
    ? shippingMessage
    : response.data.shippingPromotions?.promotionMessage
    ? response.data.shippingPromotions?.promotionMessage
    : response.data.shippingPromotions?.qualifierMessage
  const order = response.data.order
  const allIds = (order?.commerceItems || []).map((item) =>
    item.productId.replace('prd', ''),
  )
  let bopisStoreName = ''
  let bookDetailsResponse
  //avoid API calls with no params(empty cart)
  if (allIds.length !== 0) {
    bookDetailsResponse = await getBooksDetails(allIds)
  }

  const shippingRelationship = order.relationships?.map(
    (relationship): ShopCartShippingRelationshipModel => ({
      id: relationship.id,
      relationshipType: relationship.relationshipType,
      shippingGroupId: relationship.shippingGroupId,
      commerceItemId: relationship.commerceItemId,
      quantity: relationship.quantity,
    }),
  )

  const shippingGroups = order.shippingGroups?.map(
    (shippingGroup): ShopCartShippingGroupsModel => {
      if (shippingGroup.storeName) {
        bopisStoreName = shippingGroup.storeName
      }
      const shippingAddress = shippingGroup.shippingAddress
        ? {
            state: shippingGroup.shippingAddress.state,
            address1: shippingGroup.shippingAddress.address1,
            address2: shippingGroup.shippingAddress.address2,
            city: shippingGroup.shippingAddress.city,
            country: shippingGroup.shippingAddress.country,
            postalCode: shippingGroup.shippingAddress.postalCode,
            phoneNumber: shippingGroup.shippingAddress.phoneNumber,
          }
        : undefined
      return {
        shippingAddress,
        selectedShippingMethod: shippingGroup.shippingMethod,
        shippingGroupType: shippingGroup.shippingGroupClassType,
        storeId: shippingGroup.storeId,
        id: shippingGroup.id,
        proxyName: shippingGroup.proxyName,
        proxyEmail: shippingGroup.proxyEmail,
        proxyPhoneNumber: shippingGroup.proxyPhone,
        textNotificationPhoneNumber: shippingGroup.shipTextPhone,
      }
    },
  )

  const newCartItems = (order?.commerceItems || []).map((item) => {
    const details = bookDetailsResponse.data.response.productDetails.find(
      (book) => book.bnSKUId === item.productId.replace('prd', ''),
    )

    const itemDiscountAdjustment = item.priceInfo.adjustments?.find(
      (adjustment) => adjustment.adjustmentDescription === 'Item Discount',
    )
    const discountAdjustment = itemDiscountAdjustment
      ? itemDiscountAdjustment.totalAdjustment /
        itemDiscountAdjustment.quantityAdjusted
      : 0
    const newItem: ShopCartItemModel = {
      id: item.id,
      ean: item.productId.replace('prd', ''),
      skuType: details?.skuType,
      displayName: details?.displayName,
      displayAuthor: details?.contributors[0].name,
      currencyCode: '',
      storePickUp: bopisStoreName,
      freeShippingEligible: details?.eligibleForFreeShipping,
      shipItem: !item.bopisItem,
      giftMessageEligible: details?.giftMessageEligible,
      giftWrapEligible: details?.giftWrapEligible,
      giftWrapPrice: details?.giftWrapPrice,
      giftItem: item.giftItem,
      hasGiftWrap: item.hasGiftWrap,
      giftMessage: item.userEnteredGiftMessage ? item.giftMessage : '',
      deliveryPromiseDate: details?.deliveryPromiseDate,
      parentFormat: details?.parentFormat,
      unitAmount:
        item.priceInfo.currentPriceDetailsSorted?.[0]?.detailedUnitPrice,
      totalAmount: item.priceInfo.amount,
      quantity: item.quantity,
      isSafeDeleted: false,
      commerceitemclasstype: item.commerceitemclasstype,
      secondaryFormat: details?.secondaryFormat,
      salePrice: item.priceInfo.salePrice,
      listPrice: item.priceInfo.listPrice,
      discountAmount: discountAdjustment,
      discounted: item.priceInfo.discounted,
    }
    return newItem
  })

  const updatedGiftCardItems = order.paymentGroups?.map((item) => {
    const newGiftCardItem = {
      giftCardNumber: item.giftCardNumber,
      paymentId: item.id,
      paymentMethod: item.paymentMethod,
      discountAmount: item.amount,
    }
    return newGiftCardItem
  })

  const updatedPromoCode: ShopPromoCodeModel = _.isEmpty(order.couponCodes)
    ? {
        code: '',
      }
    : {
        code: order.couponCodes[Object.keys(order.couponCodes)[0]],
      }

  const updatedBookfairId: ShopBookfairModel = order.bookFairId
    ? {
        code: order.bookFairId,
      }
    : {
        code: '',
      }

  const updatedTaxExempt: ShopTaxExemptModel = order.taxExempt
    ? {
        value: order.taxExempt,
      }
    : {
        value: false,
      }

  const updatedDiscounts: ShopDiscountsModel = {
    giftCards: updatedGiftCardItems?.filter(
      (item) => item.paymentMethod === 'giftCard',
    ),
    promoCode: updatedPromoCode,
    bookfairId: updatedBookfairId,
    taxExempt: updatedTaxExempt,
  }

  const newPriceInfo: PriceInfo = {
    amount: order.priceInfo.amount,
    total: order.priceInfo.total,
    shipping: order.priceInfo.shipping,
    currencyCode: order.priceInfo.currencyCode,
    tax: order.priceInfo.tax,
    discountAmount: order.priceInfo.discountAmount,
  }

  const creditCards = order.paymentGroups?.map((item) => {
    if (item.paymentMethod === 'creditCard' && item.creditCardNumber) {
      return {
        creditCardType: item.creditCardType,
        creditCardNumber: item.creditCardNumber,
        displayNumber: item.creditCardNumber,
        nameOnCard:
          item.billingAddress?.firstName + ' ' + item.billingAddress?.lastName,
        billingAddress: item.billingAddress,
      }
    }
  })

  const cart: ShopCartModel = {
    shippingMessage: shippingPromotionMessage
      ? htmlToText(htmlHelper(shippingPromotionMessage))
      : shippingPromotionMessage,
    lastModified: order.lastModifiedTime,
    itemCount: order.commerceItemCount,
    id: order.id,
    priceInfo: newPriceInfo,
    items: newCartItems?.filter(
      (item) => item.commerceitemclasstype !== 'giftWrapCommerceItem',
    ),
    giftWrapItems: newCartItems?.filter(
      (item) => item.commerceitemclasstype === 'giftWrapCommerceItem',
    ),
    shippingRelationship,
    shippingGroups,
    discounts: updatedDiscounts,
    selectedCard: creditCards?.length ? creditCards[0] : undefined,
    digitalItems: 0,
  }
  return cart
}

const htmlHelper = (text) => {
  let i = text.indexOf('<a href')
  if (i > 0) {
    text = text.substring(0, i).trim()
  }
  return text
}

export const REFRESH_CART = 'REFRESH_CART'
export const refreshCart = makeActionCreator(REFRESH_CART)

// This is needed when prices are changed at anytime
export const refreshCartWithNewPriceAction: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  await repriceOrderDetails()
  if (getState().shop.cart?.discounts?.giftCards?.length) {
    await fetchUpdateCartGiftCardBalance()
  }
  await dispatch(refreshCartAction())
}

export const removeDigitalItemMessage: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  const cart = getState().shop.cart
  await dispatch(refreshCart({ cart: { ...cart, digitalItems: 0 } }))
}

// This is needed when no prices are changed, otherwise use refreshCartWithNewPriceAction
export const refreshCartAction: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  // TODO: api pending action to show spinner?
  const response = await getOrderDetails()
  const cart = await parseCartFromResponse(response)

  const digitalItems: ShopCartItemModel[] = cart.items.filter((item) =>
    isDigital(item.skuType),
  )

  if (digitalItems.length) {
    const digitalIds = digitalItems.map((item) => item.id)

    if (digitalIds.length > 0) {
      await dispatch(addItemToSaveForLaterListAction({ itemIds: digitalIds }))
    }

    const updatedResponse = await getOrderDetails()
    const newCart = await parseCartFromResponse(updatedResponse)
    await dispatch(
      refreshCart({ cart: { ...newCart, digitalItems: digitalItems.length } }),
    )
  } else {
    await dispatch(getSaveForLaterListAction())
    await dispatch(refreshCart({ cart: { ...cart, digitalItems: 0 } }))
  }
}

export const SET_ALL_COUNTRIES = 'SET_ALL_COUNTRIES'
const setAllCountries = makeActionCreator(SET_ALL_COUNTRIES)

export const getAllCountriesAction: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  const response = await getAllCountries()
  if (response.ok || response.status === 200) {
    await dispatch(setAllCountries(response.data.countries))
  }
}

export const SET_ALL_STATES = 'SET_ALL_STATES'
const setAllStates = makeActionCreator(SET_ALL_STATES)

export const getStatesAction: (countryCode: string) => ThunkedAction<State> = (
  countryCode,
) => async (dispatch, getState) => {
  const response = await getAllStates(countryCode)
  if (response.ok || response.status === 200) {
    await dispatch(setAllStates(response.data.states))
  }
}

export const SET_ADDRESS_DETAILS = 'SET_ADDRESS_DETAILS'
export const setAddressDetails = makeActionCreator(SET_ADDRESS_DETAILS)

export const addressDetailsAction: (
  profileId: string,
) => ThunkedAction<State> = (profileId: string) => async (
  dispatch,
  getState,
) => {
  const response = await getAddressDetails(profileId)
  if (response.ok || response.status === 200) {
    await dispatch(setAddressDetails(response.data.response.addressList))
  }
}

export const SET_ENTERED_SHIPPING_ADDRESS = 'SET_ENTERED_SHIPPING_ADDRESS'
const setEnteredShippingAddress = makeActionCreator(
  SET_ENTERED_SHIPPING_ADDRESS,
)

export const setEnteredShippingAddressAction: (
  shippingAddress: ShippingAddress,
) => ThunkedAction<State> = (shippingAddress: ShippingAddress) => async (
  dispatch,
  getState,
) => {
  await dispatch(setEnteredShippingAddress(shippingAddress))
}

export const SET_VERIFY_ADDRESS_LIST = 'SET_VERIFY_ADDRESS_LIST'
export const SET_VERIFY_ADDRESS_LIST_FETCHING =
  'SET_VERIFY_ADDRESS_LIST_FETCHING'
const setVerifyAddressList = makeActionCreator(SET_VERIFY_ADDRESS_LIST)
const setVerifyAddressListFetching = makeActionCreator(
  SET_VERIFY_ADDRESS_LIST_FETCHING,
)


export const SET_VERIFY_ADDRESS_ERROR = 'SET_VERIFY_ADDRESS_ERROR'
const setVerifyAddressErrorAction = makeActionCreator(SET_VERIFY_ADDRESS_ERROR)

export const verifyAddressAction: (
  request: VerifyAddressRequest,
) => ThunkedAction<State> = (request: VerifyAddressRequest) => async (
  dispatch,
  getState,
) => {
  dispatch(setVerifyAddressListFetching(true))
  const response = await verifyAddress(request)
  if ((response.ok || response.status === 200) && 
      response.data.verifyAddress && !response.data.verifyAddress.errorCode) {
    await dispatch(
      setVerifyAddressList(
        response.data.verifyAddress && response.data.verifyAddress.suggestions,
      ),
    )
  } else {
    dispatch(setVerifyAddressListFetching(false))
    const error: Error = {
      name: response.data.verifyAddress.errorCode,
      message: response.data.verifyAddress.errorDesc,
    }
    await dispatch(setVerifyAddressErrorAction(error))
  }
}

export const SET_UPDATE_ADDRESS_ERROR = 'SET_UPDATE_ADDRESS_ERROR'
const setUpdateAddressErrorAction = makeActionCreator(SET_UPDATE_ADDRESS_ERROR)

const addAddressToProfileCall = async (request, profileId, dispatch) => {
  const response = await addAddressToProfile(request)
  if (
    (response.ok || response.status === 200) &&
    response.data &&
    response.data.response.success
  ) {
    await dispatch(
      setAddressDetails(
        response.data.response.userDetails.userInfo.addressList,
      ),
    )
    await dispatch(
      setAddAddressToProfile(
        response.data.response.userDetails.userInfo.addressList,
      ),
    )
    await sendUpdateAddressError(null, dispatch)
  } else {
    await sendUpdateAddressError(response, dispatch)
  }
}

const sendUpdateAddressError = async (response, dispatch) => {
  if (response) {
    const error: Error = {
      name: response.data.response.code,
      message: response.data.response.message,
    }
    await dispatch(setUpdateAddressErrorAction(error))
  } else {
    await dispatch(setUpdateAddressErrorAction(null))
  }
}

const updateDefaultAddressCall = async (request, profileId, dispatch) => {
  const response = await updateDefaultAddress({
    addressNickName: request.shippingNNameId,
  })
  if (response.ok || response.status === 200) {
    await dispatch(
      setAddAddressToProfile(response.data.userDetails.userInfo.addressList),
    )
    await getAddressDetails(profileId)
  } else {
    const error: Error = {
      name: response.data.response.code,
      message: response.data.response.message,
    }
    await dispatch(setUpdateAddressErrorAction(error))
  }
}

export const SET_EDIT_SHIPPING_ADDRESS = 'SET_EDIT_SHIPPING_ADDRESS'
const setEditShippingAddress = makeActionCreator(SET_EDIT_SHIPPING_ADDRESS)

export const editShippingAddressAction: (
  request: ShippingAddress,
  profileId: string,
) => ThunkedAction<State> = (
  request: ShippingAddress,
  profileId: string,
) => async (dispatch, getState) => {
  const response = await editShippingAddress(request)
  if (
    (response.ok || response.status === 200) &&
    response.data &&
    response.data.response.success
  ) {
    await dispatch(setUpdateAddressErrorAction(null))
    await dispatch(setEditShippingAddress(response.data.shippingAddress))
    await updateDefaultAddressCall(request, profileId, dispatch)
  } else {
    const error: Error = {
      name: response.data.response.code,
      message: response.data.response.message,
    }
    await dispatch(setUpdateAddressErrorAction(error))
  }
}

//@TODO it appears this action is not used by any reducer
export const SET_ADD_ADDRESS_TO_PROFILE = 'SET_ADD_ADDRESS_TO_PROFILE'
const setAddAddressToProfile = makeActionCreator(SET_ADD_ADDRESS_TO_PROFILE)

export const addAddressToProfileAction: (
  request: ShippingAddress,
  profileId: string,
) => ThunkedAction<State> = (
  request: ShippingAddress,
  profileId: string,
) => async (dispatch, getState) => {
  await addAddressToProfileCall(request, profileId, dispatch)
}

export const SELECT_SHIPPING_ADDRESS = 'SELECT_SHIPPING_ADDRESS'
const setSelectShippingAddress = makeActionCreator(SELECT_SHIPPING_ADDRESS)

export const selectShippingAddressAction: (
  request: SelectShippingAddressRequest,
) => ThunkedAction<State> = (request: SelectShippingAddressRequest) => async (
  dispatch,
  getState,
) => {
  const response = await selectShippingAddress(request)
  if (response.ok || response.status === 200) {
    await dispatch(setSelectShippingAddress(response.data.shippingAddress))
  }
}

export const addAddressAction: (
  request: ShippingAddress,
  profileId: string,
) => ThunkedAction<State> = (
  request: ShippingAddress,
  profileId: string,
) => async (dispatch, getState) => {
  const response = await addAddress(request)
  const state = getState()
  const isGuest = !isUserLoggedInSelector(state)
  if (response.ok && response.status === 200) {
    await dispatch(setUpdateAddressErrorAction(null))
    if (isGuest) {
      const shippingGroup = response.data.order?.shippingGroups?.find(
        (group) => group.shippingGroupClassType === 'hardgoodShippingGroup',
      )
      if (shippingGroup) {
        await dispatch(setAddressDetails([shippingGroup.shippingAddress]))
      }
    } else {
      await addAddressToProfileCall(request, profileId, dispatch)
    }
  } else {
    const error: Error = {
      name: response.data.formExceptions[0].errorCode,
      message: response.data.formExceptions[0].localizedMessage,
    }
    await dispatch(setUpdateAddressErrorAction(error))
  }
}

export interface ShippingStatusParams {
  itemId: string
  status: boolean
}

export const setItemShippingStatusAction: (
  params: ShippingStatusParams,
) => ThunkedAction<State> = (params: ShippingStatusParams) => async (
  dispatch,
  getState,
) => {
  const response = await setDeliveryMethod(params)
  if (!response.ok) {
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
  } else {
    await dispatch(refreshCartWithNewPriceAction())
  }
}

export const SEND_CART_AS_GIFT = 'SEND_CART_AS_GIFT'
export const cartGiftApiStatusActions = makeApiActions('cartGift', 'CART_GIFT')

export const sendCartAsGiftAction: (params) => ThunkedAction<State> = (
  params,
) => async (dispatch) => {
  let sendAsGiftSuccessful = 0
  Object.keys(params).map(async (id) => {
    const item = params[id]
    const giftData = {
      giftItem: item.isGift,
      commerceId: id,
      giftNote: item.message,
      giftWrap: item.hasWrap,
    }

    const giftOptionsSaved = {
      message: item.message ? 'yes' : 'no',
      receipt: item.isGift ? 'yes' : 'no',
      giftWrap: item.hasWrap ? 'yes' : ' no',
    }
    await dispatch(cartGiftApiStatusActions.actions.inProgress)
    const response = await markOrRemoveProductAsGift(giftData)
    if (response.ok && response.data) {
      sendAsGiftSuccessful = sendAsGiftSuccessful + 1
      await dispatch(refreshCartWithNewPriceAction())
      dispatch(addEventAction(LL_GIFT_OPTIONS_SAVED, giftOptionsSaved))
    } else {
      if (response.data && response.data.formError) {
        await dispatch(
          setformErrorMessagesAction(CART_ERROR_MODAL, [
            {
              formFieldId: 'body',
              error: response.data.formExceptions[0].localizedMessage,
            },
          ]),
        )
      }
      dispatch(setActiveGlobalModalAction({ id: GlobalModals.CART_ERROR }))
      await dispatch(cartGiftApiStatusActions.actions.failed)
    }
    if (sendAsGiftSuccessful === Object.keys(params).length) {
      await dispatch(cartGiftApiStatusActions.actions.success)
    }
  })
}

export const GET_CART_ORDER_SUMMARY = 'CART--GET_ORDER_SUMMARY'
const cartOrderSummary = makeActionCreator<ShopOrderSummaryModel>(
  GET_CART_ORDER_SUMMARY,
)
export const cartOrderSummaryApiStatusActions = makeApiActions(
  'cartOrderSummary',
  'CART_ORDER_SUMMARY',
)

export const getShopOrderSummaryAction: () => ThunkedAction<State> = () => async (
  dispatch,
  getState,
) => {
  await cancelApiRequestFromActions(cartOrderSummaryApiStatusActions)
  // await repriceOrderDetails() This should be called prior
  const response = await fetchOrderSummary(
    undefined,
    makeRequestKeyFromActions(cartOrderSummaryApiStatusActions),
  )
  if (response.ok) {
    const orderSummary = normalizeShopOrderSummaryResponseData(response.data)
    dispatch(cartOrderSummary(orderSummary))
  }
}

const normalizeShopOrderSummaryResponseData = (data): ShopOrderSummaryModel => {
  return {
    total: data.orderTotal,
    pickUpInStore: data.pickUpInStore,
    subtotal: data.orderRawSubtotal,
    shippingAmount: data.estimatedShipping,
    taxExemptError: data.taxExemptError,
    appliedGiftCardDetails: data.appliedGiftCardDetails,
    taxAmount: data.estimatesTax,
    giftWrapAmount: data.giftWrapItemPrice,
    discountAmount: data.discounts,
  }
}

export const E_COMMERCE_ORDER_CLEAR = 'E_COMMERCE__ORDER_CLEAR'
export const orderClearAction = makeActionCreator(E_COMMERCE_ORDER_CLEAR)
