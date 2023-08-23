// import { getAtgCookie } from 'src/helpers/api/cookieHelper'
//
// const GUEST_ORDER_COOKIE = 'anonymousOrder'
// TODO: do we need?
// export const isGuestCartCheckout = async (): Promise<boolean> => {
//   const cookie = await getAtgCookie(GUEST_ORDER_COOKIE)
//   return !!cookie
// }

//reducer to count the total number of items in cart not just the distinct items
export const itemsNoReducer = (accumulator, currentItem) => {
  if (currentItem.isSafeDeleted === false) {
    return accumulator + currentItem.quantity
  } else {
    return accumulator
  }
}
