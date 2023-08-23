export interface BillingAddressModel {
  mercuryAddressId: string
  atgUserId: string
  excludeUPS: boolean
  lastName: string
  lastModified: string
  state: string
  address1: string
  class: string
  address2: string
  companyName: string | null
  city: string
  country: string
  mercuryEntityId: string | null
  addressNickname: string
  postalCode: string
  faxNumber: string
  phoneNumber: string
  verified: boolean
  defaultAddress: boolean
  mercuryAccountId: string
  atgAddressId: string
  firstName: string
}

export interface CreditCardModel {
  atgUserId: string
  creditCardId: string
  mercuryPaymentId: string
  creditCardExpYr: string
  lastModified: string
  creditCardExpMo: string
  nameOnCard: string
  class: string
  displayNumber: string
  addressId: string
  mercuryEntityId: string
  creditCardNickName: string
  billingAddress: BillingAddressModel
  creditCardToken: string
  creditCardType: string
  defaultPayment: boolean
}
