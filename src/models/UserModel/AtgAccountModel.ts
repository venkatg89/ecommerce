import { OrderSummary } from 'src/screens/cart/OrderSubmitted/SubmittedOrderSummary'
import { ShippingAddress } from '../ShopModel/CartModel'
import { MembershipModel } from './MembershipModel'

export interface AddressModel {
  atgAddressId: string
  mercuryAddressId: string
  firstName: string
  lastName: string
  state: string
  address1: string
  address2?: string
  city: string
  postalCode: string
  phoneNumber: string
}

export interface GiftCardModel {
  atgGiftCardId: string
  giftCardBalance: number
  giftCardId: string
  giftCardIndex: number
  giftCardNumber: string
  lastModified: string
  mercuryAccountId: string
  mercuryEntityId: string
  mercuryPaymentId: string
}

export interface AtgAccountModel {
  atgUserId: string
  mercuryUserId: string
  customerKey: string

  firstName: string
  lastName: string
  email: string
  registrationDate: Date

  addressList: AddressModel[]
  giftCards: GiftCardModel[]
  membership: MembershipModel

  favoriteStoreId: string
  phoneNumber?: string
  confirmPhoneNumber?: string
  explicitContentSetting?: boolean
  secretQuestionId?: string
}

// Besides User ID - rest are optional.
export interface UpdateAtgAccountDetailsModel {
  /* eslint-disable no-multi-spaces */

  // Change Name
  firstName?: string
  lastName?: string

  // Change email * WARINING *
  changeEmail?: boolean // If changing email - careful - emails are used as the use ID when logging in,
  changeMobileNumber?: boolean
  email?: string // Thus we need to evaludate the consequence before implementing this
  confirmEmail?: string // If setting email - same warning above applies.

  // Change password
  changePassword?: boolean // Set to true if changing password
  currentPassword?: string // Old Password
  password?: string // New password
  confirmPassword?: string // New password, again.

  // Secret questions
  secretQuestionId?: string
  secretAnswer?: string

  // Misc
  explicitContentSetting?: string // Explicit content setting flag. No by default

  //phone number
  mobileNumber?: string
  confirmMobileNumber?: string
  /* eslint-enable no-multi-spaces */
}

export interface AtgAddMembershipModel {
  profileId: string // Atg profile Id of the user (Mandatory if not logged in)
  programType?: string // Member type which we want to add to profile
  cardNumber: string // Member Id which we want to add to profile
}

export interface AtgConfirmPassword {
  encodedUserId: string
  password: string
  confirmPassword: string
}

export interface OrderHistoryModel {
  orderTotal: number
  orderDate: string
  nookOrder: boolean
  orderNumber: string
  orderStatus: string
}

export interface OrderDetailsItemModel {
  ean: string
  name: string
  deliveryDate: string
  orderStatus: string
  quantity: number
  itemPrice: number
}

export interface OrderDetailsModel {
  orderNumber: string
  orderDate: string
  shippingAddress: ShippingAddress
  billingAddress: ShippingAddress
  cardType?: string
  cardLastDigits?: string
  summary: OrderSummary
  groups: OrderDetailsItemGroup[]
  orderStatus: string
}

export interface OrderDetailsItemGroup {
  electronic: boolean
  bopis: boolean
  trackingNumber?: string
  storeId?: string
  items: OrderDetailsItemModel[]
}

export interface SearchOrderNumber {
  orderHistory: OrderHistoryModel
  orderDetails: OrderDetailsModel
}
