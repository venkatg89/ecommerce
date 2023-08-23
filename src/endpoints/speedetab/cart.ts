import speedetabApiRequest from 'src/apis/speedetab'

import { CartOrder, CartItemOption } from 'src/models/CafeModel/CartModel'

export const getCart = () => speedetabApiRequest({
  method: 'GET',
  endpoint: '/users/v1/orders/items',
})

export const normalizeGetCartResponseData = (data: any) => {
  const { items, promotion_code } = data // eslint-disable-line

  const cartItems = items.map((item): CartOrder => {
    const itemOptions = item.addons.map((addon): CartItemOption => ({
      id: addon.menu_addon.id,
      addonGroupId: addon.menu_addon.urls.group.split('/addon_groups/')[1],
      name: addon.menu_addon.name,
      price: addon.subtotal_amount,
      itemOptionOrderId: addon.id,
    }))

    return ({
      id: item.id,
      subtotalAmount: item.subtotal_amount,
      taxAmount: item.tax_amount,
      totalAmount: item.spend_amount,
      discountAmount: item.discount_amount,
      count: item.count,
      item: {
        id: item.menu_item.id,
        name: item.menu_item.name,
      },
      itemOptions,
    })
  })

  const promoCode = promotion_code && (typeof promotion_code === 'object') && { // eslint-disable-line
    code: promotion_code.code,
    discountAmount: promotion_code.discount_amount,
    description: promotion_code.promotion_code,
  } || undefined

  return {
    items: cartItems,
    promoCode,
  }
}

interface AddOrderAddonParams {
  menu_addon_id: string;
}

interface AddOrderParams {
  menu_item_id: string;
  count: number;
  addons_attributes: AddOrderAddonParams[];
}

export const addOrderToCart = (order: AddOrderParams) => speedetabApiRequest({
  method: 'POST',
  endpoint: '/users/v1/orders/items',
  data: {
    item: order,
  },
})

interface AddItemParams {
  itemId: string;
}

export const addItemToCart = ({ itemId }: AddItemParams) => speedetabApiRequest({
  method: 'POST',
  endpoint: '/users/v1/orders/items',
  data: {
    item: {
      menu_item_id: itemId,
    },
  },
})

interface AddItemOptionParams {
  orderId: string;
  itemOptionId: string;
}

export const addItemOptionToOrder = ({ orderId, itemOptionId }: AddItemOptionParams) => speedetabApiRequest({
  method: 'POST',
  endpoint: `/users/v1/orders/items/${orderId}/addons`,
  data: {
    addon: {
      menu_addon_id: itemOptionId,
    },
  },
})

interface RemoveOrderParams {
  orderId: string;
}

export const removeOrderFromCart = ({ orderId }: RemoveOrderParams) => speedetabApiRequest({
  method: 'DELETE',
  endpoint: `/users/v1/orders/items/${orderId}`,
})
