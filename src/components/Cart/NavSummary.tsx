import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { ShopCartModel } from 'src/models/ShopModel/CartModel'
import {
  shopCartSelector,
  cartOrderSummarySelector,
} from 'src/redux/selectors/shopSelector'
import { ShopOrderSummaryModel } from 'src/models/ShopModel/CheckoutModel'
import { getShopOrderSummaryAction } from 'src/redux/actions/shop/cartAction'
import { itemsNoReducer } from 'src/helpers/cart'

const ItemsText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey3};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const AmountText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey2};
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 16;
  margin-vertical: 8;
  align-items: flex-end;
`

interface StateProps {
  cart: ShopCartModel
  orderSummary: Nullable<ShopOrderSummaryModel>
}

const selector = createStructuredSelector<any, StateProps>({
  cart: shopCartSelector,
  orderSummary: cartOrderSummarySelector,
})

interface DispatchProps {
  getShopOrderSummary: () => void
}

const dispatcher = (dispatch) => ({
  getShopOrderSummary: () => dispatch(getShopOrderSummaryAction()),
})

type Props = StateProps & DispatchProps

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

const NavSummary = ({ cart, orderSummary, getShopOrderSummary }: Props) => {
  useEffect(() => {
    getShopOrderSummary()
  }, [cart.lastModified])

  const itemCount = cart.items.reduce(itemsNoReducer, 0)
  const totalPrice = orderSummary ? orderSummary.total.toFixed(2) : 0

  return (
    <Row>
      {itemCount === 0 ? (
        <ItemsText>No items</ItemsText>
      ) : (
        <>
          <ItemsText>{`${itemCount} ${
            itemCount > 1 ? 'items' : 'item'
          }`}</ItemsText>
          <AmountText>{`$${totalPrice}`}</AmountText>
        </>
      )}
    </Row>
  )
}

export default connector(NavSummary)
