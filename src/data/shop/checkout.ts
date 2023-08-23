import { fetchOrderSummary } from 'src/endpoints/atgGateway/cart'
import { ShopOrderSummaryModel } from 'src/models/ShopModel/CheckoutModel'

export const getShopOrderSummaryData = async (): Promise<ShopOrderSummaryModel | undefined> => {
  const response = await fetchOrderSummary()

  if (response.ok) {
    return normalizeShopOrderSummaryResponseData(response.data)
  }
  return undefined
}

const normalizeShopOrderSummaryResponseData = (data): ShopOrderSummaryModel => {
  return ({
    total: data.orderTotal,
    pickUpInStore: data.pickUpInStore,
    subtotal: data.orderRawSubtotal,
    shippingAmount: data.estimatedShipping,
    taxExemptError: data.taxExemptError,
    appliedGiftCardDetails: data.appliedGiftCardDetails,
    taxAmount: data.estimatesTax,
    giftWrapAmount: data.giftWrapItemPrice,
    discountAmount: data.discounts,
  })
}
