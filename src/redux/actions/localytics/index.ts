import LLLocalytics from 'localytics-react-native'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'

import { State } from 'src/redux/reducers'
import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'

type AttributeProps = Record<string, any>

export const LL_CUSTOMER_REGISTERED = 'Customer Registered'
export const LL_CUSTOMER_LOGGED_IN = 'Customer Logged In'
export const LL_SEARCHED = 'Searched'
export const LL_PRODUCT_VIEWED = 'Product Viewed'
export const LL_FILTERED_APPLIED = 'Filter Applied'
export const LL_PRODUCT_DETAILS_VIEWED = 'Product Details Viewed'
export const LL_READ_SAMPLE_VIEWED = 'Read Sample Viewed'
export const LL_PRODUCT_SHARED = 'Product Shared'
export const LL_REVIEW_SUBMITTED = 'Review Submitted'
export const LL_ADD_TO_LIST = 'Add To List'
export const LL_STORE_CHANGED = 'Store Changed'
export const LL_STORE_DETAILS_VIEWED = 'Store Details Viewed'
export const LL_STORE_EVENT_VIEWED = 'Store Event Viewed'
export const LL_GIFT_REDEEMED = 'Gift Card Redeemed'
export const LL_GIFT_CARD_BALANCE_CHECKED = 'Gift Card Balance checked'
export const LL_PAYMENT_ADDED = 'Payment Added'

export const LL_ADD_TO_CART = 'Add To Cart'
export const LL_REMOVE_FROM_CART = 'Remove From Cart'
export const LL_SAVE_FOR_LATER = 'Save For Later'
export const LL_CHECKOUT_STARTED = 'Checkout Started'
export const LL_GIFT_OPTIONS_SAVED = 'Gift Options Saved'
export const LL_CHECKOUT_COMPLETED = 'Checkout Completed'
export const LL_ITEM_PURCHASED = 'Item Purchased'

export const LL_CHOOSE_CAFE_STORE = 'Choose Cafe Store'
export const LL_CAFE_ORDER_STARTED = 'Cafe Order Started'
export const LL_CHOOSE_CAFE_PRODUCT_TYPE = 'Choose Cafe Product Type'
export const LL_CHOOSE_CAFE_PRODUCT_SIZE = 'Choose Cafe Product Size'
export const LL_ADD_TO_CAFE_CART = 'Add to Cafe Cart'
export const LL_REMOVE_FROM_CAFE_CART = 'Remove from Cafe Cart'
export const LL_NUTRITIONAL_INFO_DOWNLOADED = 'Nutritional Info Downloaded'
export const LL_CAFE_PAYMENT_ADDED = 'Cafe Payment Added'
export const LL_MEMBERSHIP_DETAILS = 'Membership Details'
export const LL_CAFE_ITEMS_PURCHASED = 'Cafe Items Purchased'
export const LL_CAFE_CHECKOUT_COMPLETE = 'Cafe Checkout Complete'

export const LL_HOME_VIEWED = 'Home Viewed'
export const LL_STORES_VIEWED = 'Stores Viewed'
export const LL_CART_VIEWED = 'Cart Viewed'
export const LL_SEARCH_VIEWED = 'Search Viewed'
export const LL_CAFE_VIEWED = 'Cafe Viewed'
export const LL_PROFILE_VIEWED = 'Profile Viewed'
export const LL_WISHLIST_VIEWED = 'WishList Viewed'
export const LL_MY_ACCOUNT_VIEWED = 'My Account Viewed'
export const LL_ACCOUNT_SETTINGS_VIEWED = 'Account Setting Viewed'
export const LL_PAYMENT_METHODS_VIEWED = 'Payment Methods Viewed'
export const LL_ADDRESS_BOOK_VIEWED = 'Address Book Viewed'
export const LL_GIFT_CARDS_VIEWED = 'Gift Cards Viewed'
export const LL_MEMBERSHIPS_VIEWED = 'Memberships Viewed'
export const LL_REVIEW_PAGE_VIEWED = 'Review Page Viewed'

export const addEventAction: (
  eventName: string,
  _attributes?: AttributeProps,
  withUser?: boolean,
) => ThunkedAction<State> = (
  eventName,
  _attributes = {},
  withUser = false,
) => async (dispatch, getState) => {
  const state = getState()
  const atgAccount = myAtgAccountSelector(state)

  let attributes = { ..._attributes }

  if (atgAccount) {
    const { atgUserId } = atgAccount
    const customerIdHash = hmacSHA256(atgUserId, atgUserId).toString(Hex)

    if (withUser && customerIdHash) {
      attributes = { customerId: customerIdHash, ...attributes }
    }
  }

  LLLocalytics.tagEvent({ name: eventName, attributes })
}
