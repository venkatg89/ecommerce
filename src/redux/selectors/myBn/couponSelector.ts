import { State } from 'src/redux/reducers'

export const couponsSelector = (state: State) => state.stores.coupons

export const filterCouponsByIdsSelector = (state: State, ownProps) => {
  const { ids = [] } = ownProps
  const coupons = couponsSelector(state)
  return ids.filter(o => !!o).map(id => coupons[id]).filter(o => !!o)
}

export const couponSelector = (state: State, ownProps) => {
  const { id } = ownProps
  const coupons = couponsSelector(state)
  return coupons[id]
}
