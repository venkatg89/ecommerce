import atgApiRequest from 'src/apis/atgGateway'
import { BOPIS, SHIP_TO_HOME } from 'src/constants/shop'
import {
  SelectShippingAddressRequest,
  ShippingAddress,
} from 'src/models/ShopModel/CartModel'

/* -= Endpoints =- */
const GET_ORDER_DETAILS = '/order-details/detailed'
const GET_REPRICE_ORDER = '/cart-checkout/repriceOrder'
const CHECKOUT = '/cart-checkout/checkout'
const MARK_OR_REMOVE_PRODUCT_AS_GIFT =
  '/cart-checkout/markOrRemoveProductAsGift'
const UPDATE_QUANTITY = '/cart-checkout/updateQuantity'
const REMOVE_ITEM = '/cart-checkout/removeItemFromOrder'
const CLAIM_COUPON = '/cart-checkout/claimCoupon'
const CLAIM_GIFT_CARD = '/cart-checkout/applyGiftCard'
const REMOVE_GIFT_CARD = '/cart-checkout/removeGiftCardOrKidsClubCertifcate'
const CLAIM_BOOKFAIRID = '/cart-checkout/applyBookFairId'
const CLAIM_MEMBERSHIP = '/memberships/addMembershipToProfile'
const REMOVE_BOOKFAIR = '/cart-checkout/removeBookFairId'
const ADD_TAXT_EXEMPT = 'cart-checkout/applyTaxExemption'
const REMOVE_PROMO_CODE = '/cart-checkout/removeCoupon'
const GET_ORDER_SUMMARY = '/order-details/getOrderSummary'
const GET_SUBMITTED_ORDER = '/order-details/v1/getOrderDetails'
const CHECK_GIFT_CARD = '/cart-checkout/checkAppliedGCAndRemainingBalance'

const GET_ORDER_DELIVERY_OPTIONS = '/cart-checkout/getDeliveryOptions'
const SET_CART_ITEM_DELIVERY_OPTION = '/cart-checkout/updateShippingMethod'
const ADD_BOPIS_TEXT_NOTIFICATION = '/cart-checkout/updateTextNotification'
const REMOVE_BOPIS_TEXT_NOTIFICATION = '/cart-checkout/removeTextNotification'
const SET_BOPIS_PROXY = '/cart-checkout/updateProxyDetails'
const SET_DELIVERY_METHOD = '/cart-checkout/setItemAsBOPIS'
const SET_PICKUP_STORE = '/cart-checkout/changeBopisStoreInOrder'
const ADD_SHIPPING_ADDRESS = '/cart-checkout/addShippingAddress'
const EDIT_SHIPPING_ADDRESS = '/cart-checkout/v1/editShippingAddress'
const SELECT_SHIPPING_ADDRESS = '/cart-checkout/v1/selectShippingAddress'
const ADD_BILLING_ADDRESS_AND_CARD_DETAILS =
  '/cart-checkout/v1/addBillingAddressAndCardDetails'
const ACC_CARD_ON_PROFILE = '/my-account/addCreditCardOnProfile'
const GET_CREDIT_CARD_LIST = '/my-account/v1/getCreditCardList'
const DELETE_CC_FROM_PROFILE = '/my-account/deletePaymentFromProfile'
const SET_CC_AS_DEFAULT = '/my-account/setCreditCardAsDefault'
const COMMIT_ORDER = '/order-details/v1/commitOrder'
const IS_CVV_REQUIRED = '/cart-checkout/isCvvRequired'
const ADD_ITEM_TO_ORDER = '/cart-checkout/addItemToOrder'
const ADD_BOPIS_ITEM_TO_ORDER = '/cart-checkout/addBOPISItemToOrder'
const ADD_PROTECTION_PLAN_TO_ORDER =
  'cart-checkout/addProtectionPlanItemToOrder'
const EDIT_CREDIT_CARD = '/cart-checkout/editPaymentInfo'
const UPDATE_PAYMENT_FROM_PROFILE = '/my-account/updatePaymentFromProfile'
const SELECT_CHECKOUT_PAYMENT = '/cart-checkout/selectPayment'
const SUBSCRIBE_TO_MARKETING = '/global/signUpForBNEmails'

/* -= API Requests =- */
export const subscribeToMarketingEmails = (email: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: SUBSCRIBE_TO_MARKETING,
    data: { email: email },
  })

interface SetProtectionPlanParams {
  protectionPlanLinkToCommerceItemID: string
  quantity: string
  selectedPlan: string
}
export const addProtectionPlanToOrder = (data: SetProtectionPlanParams) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: ADD_PROTECTION_PLAN_TO_ORDER,
    data,
  })
}

export const selectCheckoutPayment = (data) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: SELECT_CHECKOUT_PAYMENT,
    data,
  })
}

export const getSubmittedOrder = (email: string, orderId: string) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: GET_SUBMITTED_ORDER,
    data: {
      email: email,
      orderId: orderId,
    },
  })
}

export interface AddItemData {
  catalogRefIds: string
  quantity: number
  productId: string
  webPrice?: number
  listPrice?: number
  skuType?: string
}

export const addItemToCart = (data: AddItemData) => {
  return atgApiRequest({
    headers: {
      Accept: '*/*',
    },
    method: 'POST',
    endpoint: ADD_ITEM_TO_ORDER,
    data: data,
  })
}

export const addItemAsBopis = (data: AddItemData) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: ADD_BOPIS_ITEM_TO_ORDER,
    data: data,
  })
}

export const editCreditCard = (data) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: EDIT_CREDIT_CARD,
    data,
  })
}

export const updatePaymentFromProfile = (data) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: UPDATE_PAYMENT_FROM_PROFILE,
    data,
  })
}

export const isCvvRequired = (data) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: IS_CVV_REQUIRED,
    data,
  })
}

export const commitOrder = (data) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: COMMIT_ORDER,
    data: {
      cvvRequired: data.cvv ? true : false,
      allowEmptyOrders: true,
      rentalTerms: false,
      cvv: data.cvv,
      orderId: data.orderId,
    },
  })
}

export const checkout = (data) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: CHECKOUT,
    data: data,
  })
}

export const setCCAsDefault = (params: {
  atgUserId: string
  creditCardNickName: string
}) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: SET_CC_AS_DEFAULT,
    data: {
      profileId: params.atgUserId,
      creditCardNickName: params.creditCardNickName,
    },
  })
}

export const removeCCFromProfile = (params: {
  atgUserId: string
  creditCardNickName: string
}) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: DELETE_CC_FROM_PROFILE,
    data: {
      profileId: params.atgUserId,
      creditCardNickName: params.creditCardNickName,
    },
  })
}

export const getCreditCardList = (params: { atgUserId: string }) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: GET_CREDIT_CARD_LIST,
    data: {
      profileId: params.atgUserId,
    },
  })
}

export const addBillingAndCard = async (params) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: ADD_BILLING_ADDRESS_AND_CARD_DETAILS,
    data: params,
  })
}

export const addCardOnProfile = async (params) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: ACC_CARD_ON_PROFILE,
    data: params,
  })
}

export const getOrderDetails = () =>
  atgApiRequest({
    method: 'POST',
    endpoint: GET_ORDER_DETAILS,
  })

export const setDeliveryMethod = (params) => {
  const receiveProductAs = params.status ? SHIP_TO_HOME : BOPIS
  return atgApiRequest({
    method: 'POST',
    endpoint: SET_DELIVERY_METHOD,
    data: {
      receiveProductAs,
      itemId: params.itemId,
    },
  })
}

export const setPickupStore = (params) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: SET_PICKUP_STORE,
    data: {
      storeId: params.store.id,
    },
  })
}

export const repriceOrderDetails = () =>
  // to sync with www
  atgApiRequest({
    method: 'POST',
    endpoint: GET_REPRICE_ORDER,
  })

interface CartGiftData {
  giftItem: boolean
  commerceId: string
  giftNote: string
  giftWrap: boolean
}

export const markOrRemoveProductAsGift = (data: CartGiftData) =>
  atgApiRequest({
    method: 'POST',
    endpoint: MARK_OR_REMOVE_PRODUCT_AS_GIFT,
    data,
  })

export const updateQuantity = (
  commerceId: string,
  isProtectionPlanItem: boolean,
  newQuantity: number,
) =>
  atgApiRequest({
    method: 'POST',
    endpoint: UPDATE_QUANTITY,
    data: {
      [commerceId]: '' + newQuantity,
      isProtectionPlanItem: isProtectionPlanItem,
      updatedCommerceItemId: commerceId,
    },
  })

export const removeItems = (idList: string[]) =>
  atgApiRequest({
    method: 'POST',
    endpoint: REMOVE_ITEM,
    data: {
      removalCommerceIds: idList.reduce(
        (prev, current, index) =>
          prev + (index === idList.length - 2 ? '' : ',') + current,
      ),
    },
  })

export const getDeliveryOptions = () =>
  atgApiRequest({
    method: 'POST',
    endpoint: GET_ORDER_DELIVERY_OPTIONS,
  })

export const setCartItemShippingMethod = ({
  shippingMethodId,
  shippingGroupId,
}) =>
  atgApiRequest({
    method: 'POST',
    endpoint: SET_CART_ITEM_DELIVERY_OPTION,
    data: {
      shipMethodId: shippingMethodId,
      shippingGroupID: shippingGroupId,
    },
  })

export const setBopisTextNotification = (phoneNumber) =>
  atgApiRequest({
    method: 'POST',
    endpoint: ADD_BOPIS_TEXT_NOTIFICATION,
    data: {
      phoneNo: phoneNumber,
    },
  })

export const removeBopisTextNotification = (shippingGroupId) =>
  atgApiRequest({
    method: 'POST',
    endpoint: REMOVE_BOPIS_TEXT_NOTIFICATION,
    data: {
      shippingGroupId,
    },
  })

interface SetBopisProxyParams {
  name?: string
  email?: string
  phoneNumber?: string
  proxyPickUp: boolean
}
export const setBopisProxy = ({
  phoneNumber,
  name,
  email,
  proxyPickUp,
}: SetBopisProxyParams) =>
  atgApiRequest({
    method: 'POST',
    endpoint: SET_BOPIS_PROXY,
    data: {
      proxyPhone: phoneNumber,
      proxyName: name,
      proxyEmail: email,
      selfPickUp: !proxyPickUp,
    },
  })
export const addPromoCode = (promoCode: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: CLAIM_COUPON,
    data: {
      couponCode: promoCode,
    },
  })

export const addGiftCard = (giftCard: string, pin: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: CLAIM_GIFT_CARD,
    data: {
      giftCardNumber: giftCard,
      pin: pin,
    },
  })

export const redeemFromAccount = (index: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: CLAIM_GIFT_CARD,
    data: {
      savedGiftcardIndex: index,
    },
  })

export const TaxExempt = (taxExempt: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: ADD_TAXT_EXEMPT,
    data: {
      taxExempt: taxExempt,
    },
  })

export const addBookfairId = (bookfairId: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: CLAIM_BOOKFAIRID,
    data: {
      bookFairID: bookfairId,
    },
  })

export const addMembership = (number: string, type: string, id?: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: CLAIM_MEMBERSHIP,
    data: {
      profileId: id,
      programType: type,
      cardNumber: number,
    },
  })

export const removeGiftCard = (paymentId: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: REMOVE_GIFT_CARD,
    data: {
      paymentGroupId: paymentId,
    },
  })
export const removeBookfair = () =>
  atgApiRequest({
    method: 'POST',
    endpoint: REMOVE_BOOKFAIR,
  })

export const removePromoCode = (promoCode: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: REMOVE_PROMO_CODE,
    data: {
      couponCode: promoCode,
    },
  })

export const addAddress = (request: ShippingAddress) =>
  atgApiRequest({
    method: 'POST',
    endpoint: ADD_SHIPPING_ADDRESS,
    data: request,
  })

export const editShippingAddress = (request: ShippingAddress) =>
  atgApiRequest({
    method: 'POST',
    endpoint: EDIT_SHIPPING_ADDRESS,
    data: request,
  })

export const selectShippingAddress = (request: SelectShippingAddressRequest) =>
  atgApiRequest({
    method: 'POST',
    endpoint: SELECT_SHIPPING_ADDRESS,
    data: request,
  })
export const fetchOrderSummary = (orderId?: string, requestKey?) =>
  atgApiRequest({
    method: 'POST',
    endpoint: GET_ORDER_SUMMARY,
    data: {
      ...(orderId
        ? {
            cartPage: 'false',
            isPostOrder: 'true',
            orderNumber: orderId,
          }
        : {
            cartPage: 'false',
          }),
    },
    requestKey,
  })

export const fetchUpdateCartGiftCardBalance = () =>
  atgApiRequest({
    method: 'POST',
    endpoint: CHECK_GIFT_CARD,
  })
