export interface ShopCartItemModel {
  id: string
  ean: string
  skuType: string
  displayName: string
  displayAuthor: string
  totalAmount: number
  unitAmount: number
  discountAmount: number
  quantity: number
  currencyCode: string
  freeShippingEligible: boolean
  // Used to undo cart removals; if this is true, the item will appear as " {displayName} has been removed. Undo"
  isSafeDeleted: boolean
  shipItem: boolean
  storePickUp: string
  giftMessageEligible: boolean
  giftWrapEligible: boolean
  giftWrapPrice: number
  giftItem: boolean
  hasGiftWrap: boolean
  giftMessage: string
  commerceitemclasstype: string
  secondaryFormat: string
  salePrice: number
  listPrice: number
  discounted: boolean
  deliveryPromiseDate?: string
  parentFormat?: string
}

export interface ShopGiftCardModel {
  giftCardNumber: string
  paymentId: string
  paymentMethod: string
  discountAmount: number
  discounts: ShopDiscountsModel
}

export interface ShopPromoCodeModel {
  code: string
}

export interface ShopBookfairModel {
  code: string
}

export interface ShopTaxExemptModel {
  value: boolean
}

export interface ShopDiscountsModel {
  giftCards: ShopGiftCardModel[]
  promoCode: ShopPromoCodeModel
  bookfairId: ShopBookfairModel
  taxExempt: ShopTaxExemptModel
}

//interface for selected payment option
export interface CreditCardDisplay {
  creditCardType: string
  creditCardNumber: string
}

export interface ShopCartModel {
  shippingMessage: string | undefined
  lastModified: number // in time
  id: string
  priceInfo: PriceInfo
  items: ShopCartItemModel[]
  giftWrapItems: ShopCartItemModel[]
  shippingRelationship: ShopCartShippingRelationshipModel[]
  shippingGroups: ShopCartShippingGroupsModel[]
  itemCount: number
  discounts: ShopDiscountsModel
  countries?: Map<string, string>
  states?: Map<string, string>
  enteredShippingAddress?: ShippingAddress
  suggestedShippingAddressList?: ShippingAddress[]
  addressList?: ShippingAddress[]
  editShippingAddress?: ShippingAddress
  verifyListFetching?: boolean
  selectedCard?: CreditCardDisplay
  getAddressError?: Error
  verifyAddressError?: Error
  digitalItems: number // should only used to display the "x digital items moved to save for later"
}

export interface ShopCartShippingRelationshipModel {
  id: string
  relationshipType: string
  shippingGroupId: string
  commerceItemId: string
  quantity: number
}

export interface ShopCartShippingGroupsModel {
  shippingAddress?: ShippingGroupShippingAddress
  selectedShippingMethod: string
  id: string
  shippingGroupType: string
  proxyName?: string
  proxyEmail?: string
  proxyPhoneNumber?: string
  textNotificationPhoneNumber?: string
  storeId?: string
}

export interface ShippingGroupShippingAddress {
  state: string
  address1: string
  address2: string
  city: string
  country: string
  postalCode: string
  phoneNumber: string
}

export interface PriceInfo {
  amount: number
  total: number
  shipping: number
  currencyCode: string
  tax: number
  discountAmount: number
}

export interface CartItem {
  id: string
  name: string
}

export interface CartItemOption {
  id: number
  addonGroupId: string
  name: string
  price: number
  itemOptionOrderId: string
}

export interface CartOrder {
  id: string
  subtotalAmount: number
  taxAmount: number
  totalAmount: number
  discountAmount: number
  count: number
  item: CartItem
  itemOptions: CartItemOption[]
}

export interface CartPromoCodes {
  code: string
  discountAmount: number
  description: string
}

export interface CartGiftCard {
  code: string
  discountAmount: number
  description: string
}

export interface CartOtherDiscounts {
  code: string
  discountAmount: number
  description: string
}

export interface CartSummary {
  items: CartOrder[]
  promoCode?: CartPromoCodes
  giftCard?: CartGiftCard
  otherDiscounts?: CartOtherDiscounts
}
export interface CartSummary {
  items: CartOrder[]
}

export interface ShippingAddress {
  country?: string
  firstName?: string
  lastName?: string
  address1?: string
  address2?: string
  postalCode?: string
  city?: string
  state?: string
  phoneNumber?: string
  companyName?: string
  addressNickname?: string
  editAddressNickName?: string
  shippingNNameId?: string
  isPostOrder?: boolean
  atgAddressId?: string
  excludeUPS?: boolean
  defaultAddress?: boolean
  makeDefault?: boolean
  profileId?: string
}

export interface VerifyAddressRequest {
  country?: string
  address1?: string
  address2?: string
  postal?: string
  city?: string
  state?: string
}

export interface SelectShippingAddressRequest {
  isPostOrder: boolean
  shippingNNameId: string
}

export interface CartGiftItem {
  isGift: boolean
  hasWrap: boolean
  message: string
}
