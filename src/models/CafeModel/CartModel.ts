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

export interface CartSummary {
  items: CartOrder[]
  promoCode?: CartPromoCodes
}

export interface AddOrderToCart {
  itemId: string
  name?: string
  image?: string
  selectedItemOptions: Record<string, string[]>
  outOfStock?: boolean
  count?: number
}
