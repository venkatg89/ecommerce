export interface ShopDeliverySpeedModel {
  shippingMethodId: string
  deliveryPromise: string
  displayName: string
  shippingPrice: number
}

// id is shippingGroupId
export type ShopDeliveryOptionsModel = Record<string, ShopDeliverySpeedModel[]>
