import {
  CafeCurrentOrder,
  CafeRecentOrder,
} from 'src/models/CafeModel/OrderModel'

export const recentOrderNormalizer = (order): CafeRecentOrder => {
  const items = order.items.map((item) => {
    const itemOptions = item.addons.reduce((obj, itemOption) => {
      obj[itemOption.id] = [
        ...(obj[itemOption.id] || []),
        itemOption.menu_addon.id,
      ]
      return obj
    }, {})

    return {
      itemId: item.menu_item.id,
      name: item.menu_item.name,
      image: item.menu_item.images.list,
      selectedItemOptions: itemOptions,
      count: item.count,
      outOfStock: item.menu_item.out_of_stock,
    }
  })

  return {
    id: order.id,
    subtotalAmount: order.subtotal,
    taxAmount: order.tax,
    totalAmount: order.total,
    discountAmount: order.discount_amount,
    items,
    orderStatus: order.state,
    venueId: order.venue.id,
    imageUrl: order.items[0].menu_item.images.cover,
    dateCreated: order.created_at,
    dateFulfilled: order.closed_at,
  }
}

export const currentOrderNormalizer = (order): CafeCurrentOrder => ({
  id: order.id,
  totalAmount: order.total,
  orderStatus: order.state,
  venueId: order.venue.id,
  pickupCode: order.pickup_code,
  date: order.created_at,
})
