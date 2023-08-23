import React, { useState, useEffect } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { withNavigationFocus, NavigationFocusInjectedProps } from 'react-navigation'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import Button from 'src/controls/Button'

import { CafeCurrentOrder } from 'src/models/CafeModel/OrderModel'

import { fetchCurrentOrdersAction } from 'src/redux/actions/cafe/orderAction'
import { openCafeOrderProgressModalAction } from 'src/redux/actions/modals/cafeOrderProgress'
import { currentOrdersSelector } from 'src/redux/selectors/cafeSelector'

const Wrapper = styled.View``

const OrderProgressButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
`

interface OwnProps {
  style?: StyleProp<ViewStyle>;
}

interface StateProps {
  currentOrders: CafeCurrentOrder[];
}

const selector = createStructuredSelector({
  currentOrders: currentOrdersSelector,
})

interface DispatchProps {
  fetchCurrentOrders: () => void;
  openCafeOrderProgressModal: () => void;
}

const dispatcher = dispatch => ({
  fetchCurrentOrders: () => dispatch(fetchCurrentOrdersAction()),
  openCafeOrderProgressModal: () => dispatch(openCafeOrderProgressModalAction()),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & DispatchProps & OwnProps & NavigationFocusInjectedProps

const OrderProgress = ({ style, fetchCurrentOrders, openCafeOrderProgressModal, currentOrders, isFocused }: Props) => {
  const [pendingUpdateState, setPendingUpdateState] = useState<boolean>(true)

  useEffect(() => {
    async function _fetchCurrentOrders() {
      await fetchCurrentOrders()
      setPendingUpdateState(false)
    }

    if (isFocused) {
      _fetchCurrentOrders()
    } else {
      setPendingUpdateState(true)
    }
  }, [isFocused])

  // if there was a previous order, the old currentOrder.length > 0, show button disabled instead
  if (!currentOrders.length) { return null }

  return (
    <Wrapper style={ style }>
      <OrderProgressButton
        variant="outlined"
        onPress={ openCafeOrderProgressModal }
        maxWidth
        linkGreen
        center
        disabled={ pendingUpdateState }
      >
        { pendingUpdateState ? 'Checking recent orders...' : 'View orders in progress' }
      </OrderProgressButton>
    </Wrapper>
  )
}

export default withNavigationFocus(connector(OrderProgress))
