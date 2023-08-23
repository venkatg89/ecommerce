export interface ShopOrderSummaryModel {
  total: number
  pickUpInStore?: string
  subtotal: number
  shippingAmount: number
  taxExemptError: boolean
  appliedGiftCardDetails: Record<string, number>
  taxAmount: number,
  giftWrapAmount: number,
  discountAmount: number,
  // caRecyclingFee: number,
}
