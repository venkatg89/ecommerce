import { Reducer } from 'redux'
import { ShopCartModel } from 'src/models/ShopModel/CartModel'
import {
  E_COMMERCE_MODIFY_SHOP_CART,
  E_COMMERCE_SAFE_REMOVE_ITEM,
  SET_ITEM_PICKUP_STORE,
  SET_ITEM_SHIPPING_STATUS,
  REFRESH_CART,
  SET_ALL_COUNTRIES,
  SET_ALL_STATES,
  SET_ENTERED_SHIPPING_ADDRESS,
  SET_VERIFY_ADDRESS_LIST,
  SET_VERIFY_ADDRESS_LIST_FETCHING,
  SET_UPDATE_ADDRESS_ERROR,
  SET_VERIFY_ADDRESS_ERROR,
  E_COMMERCE_ORDER_CLEAR,
} from 'src/redux/actions/shop/cartAction'
import {
  modifyShopCartHelper,
  safeRemoveItemHelper,
  setPickupStoreHelper,
  setShippingStatusHelper,
  refreshCartHelper,
} from './helpers'

export type ShopCartState = ShopCartModel

// test data
const DEFAULT: ShopCartState = {
  shippingMessage: '',
  id: '0',
  priceInfo: {
    amount: 0,
    total: 0,
    shipping: 0,
    currencyCode: 'USD',
    tax: 0,
    discountAmount: 0,
  },
  items: [],
  lastModified: 0,
  shippingRelationship: [],
  discounts: {
    giftCards: [],
    promoCode: { code: '' },
    bookfairId: { code: '' },
    taxExempt: { value: false },
  },
  shippingGroups: [],
  giftWrapItems: [],
  itemCount: 0,
  countries: new Map(),
  states: new Map(),
  enteredShippingAddress: {},
  suggestedShippingAddressList: [],
  verifyListFetching: false,
  verifyAddressError: undefined,
  getAddressError: {
    name: '',
    message: '',
  },
  digitalItems: 0,
}

const ShopCart: Reducer<ShopCartState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case E_COMMERCE_MODIFY_SHOP_CART:
      return modifyShopCartHelper(state, action)

    case E_COMMERCE_SAFE_REMOVE_ITEM:
      return safeRemoveItemHelper(state, action)

    case SET_ITEM_PICKUP_STORE: {
      return setPickupStoreHelper(state, action)
    }
    case SET_ITEM_SHIPPING_STATUS: {
      return setShippingStatusHelper(state, action)
    }
    case REFRESH_CART: {
      return refreshCartHelper(state, action)
    }
    case SET_ALL_COUNTRIES: {
      return { ...state, countries: { ...action.payload } }
    }
    case SET_ALL_STATES: {
      return { ...state, states: { ...action.payload } }
    }
    case SET_ENTERED_SHIPPING_ADDRESS: {
      return { ...state, enteredShippingAddress: { ...action.payload } }
    }
    case SET_VERIFY_ADDRESS_LIST_FETCHING: {
      return { ...state, verifyListFetching: action.payload }
    }
    case SET_VERIFY_ADDRESS_LIST: {
      return {
        ...state,
        suggestedShippingAddressList: [...action.payload],
        verifyListFetching: false,
        verifyAddressError: undefined
      }
    }
    case SET_UPDATE_ADDRESS_ERROR: {
      return { ...state, getAddressError: { ...action.payload } }
    }

    case SET_VERIFY_ADDRESS_ERROR: {
      return { ...state, verifyAddressError: { ...action.payload } }
    }

    case E_COMMERCE_ORDER_CLEAR: {
      return DEFAULT
    }

    default:
      return state
  }
}

export default ShopCart
