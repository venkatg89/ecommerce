import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { CartSummary } from 'src/models/CafeModel/CartModel'
import { cafeCartSelector } from 'src/redux/selectors/cafeSelector'
import styled from 'styled-components/native'
import { nav } from 'assets/images'

interface IconProps {
  active: boolean
}

const TabIconContainer = styled.View`
  position: relative;
`

const TabIcon = styled.Image<IconProps>`
  width: ${({ theme }) => theme.spacing(4)};
  height: ${({ theme }) => theme.spacing(4)};
  tint-color: ${({ active, theme }) =>
    active ? theme.palette.primaryGreen : theme.palette.grey3};
`

const CartItemCount = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.primaryGreen};
  border-radius: 9;
  height: 16;
  width: 16;
  position: absolute;
  top: -5;
  left: 20;
  background-color: ${({ theme }) => theme.palette.supportWarning};
  overflow:hidden;
  text-align: center;
`

interface OwnProps {
  focused?: boolean
}

interface StateProps {
  cartData: CartSummary
}

const selector = createStructuredSelector({
  cartData: cafeCartSelector,
})

const connector = connect<StateProps, {}>(selector)

type Props = StateProps & OwnProps

const TabBarCheckoutIcon = ({ cartData, focused }: Props) => {
  const itemsCount = cartData && cartData.items && cartData.items.length
  const { cart, activeCart } = nav.tabs
  const icon = focused ? activeCart : cart

  return (
    <TabIconContainer>
      <TabIcon active={focused} source={icon} />
      {itemsCount > 0 && <CartItemCount>{itemsCount}</CartItemCount>}
    </TabIconContainer>
  )
}

export default connector(TabBarCheckoutIcon)
