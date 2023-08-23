import { AddOrderToCart } from 'src/models/CafeModel/CartModel'

export default function ({ itemId, selectedItemOptions }: AddOrderToCart) {
  let hash = itemId
  Object.values(selectedItemOptions).map((itemOptionId) => { hash += `-${itemOptionId}` }) // eslint-disable-line
  return hash
}
