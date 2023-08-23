import React from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import { cartItemCountSelector } from 'src/redux/selectors/widgetSelector'

const CountText = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.grey1};
  border-radius: 9;
  height: 16;
  width: 16;
  position: absolute;
  right: 20
  background-color: ${({ theme }) => theme.palette.supportWarning};
  overflow: hidden;
  text-align: center;
`

interface StateProps {
  count: number;
}

const selector = createStructuredSelector({
  count: cartItemCountSelector,
})

const connector = connect<StateProps, {}, {}>(selector)

type Props = StateProps

const CartItemCount = ({ count }: Props) => {
  if (!count) { return null }

  return (
    <CountText>
      { count }
    </CountText>
  )
}

export default connector(CartItemCount)
