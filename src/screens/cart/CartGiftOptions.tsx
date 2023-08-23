import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import styled from 'styled-components/native'
import CartGiftOptionsItem from 'src/components/Cart/CartGiftOptionsItem'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Button from 'src/controls/Button'

import { navigate, Routes } from 'src/helpers/navigationService'
import { RequestStatus } from 'src/models/ApiStatus'
import { ShopCartModel, CartGiftItem } from 'src/models/ShopModel/CartModel'

import { sendCartAsGiftAction } from 'src/redux/actions/shop/cartAction'
import {
  shopCartSelector,
  cartGiftApiStatusSelector,
} from 'src/redux/selectors/shopSelector'
import { usePrevious } from 'src/helpers/usePrevious'

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentStyle: {
    paddingHorizontal: 0,
  },
}

const ContainerNotice = styled.View`
  border-bottom-color: ${({ theme }) => theme.palette.grey5};
  border-bottom-width: 1;
`

const NoticePickUpText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const Separator = styled.View`
  border-bottom-color: ${({ theme }) => theme.palette.grey5};
  border-bottom-width: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

interface StateProps {
  cart: ShopCartModel
  sendCartApiStatus: Nullable<RequestStatus>
}

interface DispatchProps {
  sendCartAsGift: (params) => void
}

const selector = createStructuredSelector<any, StateProps>({
  cart: shopCartSelector,
  sendCartApiStatus: cartGiftApiStatusSelector,
})

const dispatcher = (dispatch) => ({
  sendCartAsGift: (params) => dispatch(sendCartAsGiftAction(params)),
})

type Props = StateProps & DispatchProps

const connector = connect<StateProps, DispatchProps>(selector, dispatcher)

const CartGiftOptions = ({
  cart,
  sendCartAsGift,
  sendCartApiStatus,
}: Props) => {
  const hasItemsForPickUp = cart.items.some((item) => item.shipItem === false)
  const [statusGiftApi, setStatusGiftApi] = useState<Nullable<RequestStatus>>(
    null,
  )
  const previousStatusGiftApi = usePrevious(statusGiftApi)
  let [cartGiftOptions, setCartGiftOptions] = useState<CartGiftItem[]>([])

  const handleOptions = (
    itemId: string,
    isGift: boolean,
    hasWrap: boolean,
    message: string,
  ) => {
    cartGiftOptions = {
      ...cartGiftOptions,
      [itemId]: {
        isGift,
        hasWrap,
        message,
      },
    }

    setCartGiftOptions(cartGiftOptions)
  }

  useEffect(() => {
    if (
      previousStatusGiftApi === RequestStatus.FETCHING &&
      statusGiftApi === RequestStatus.SUCCESS
    ) {
      navigate(Routes.CART__CHECKOUT)
      setStatusGiftApi(null)
    }
  }, [statusGiftApi])

  useEffect(() => {
    setStatusGiftApi(sendCartApiStatus)
  }, [sendCartApiStatus])

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollContainer withAnchor contentContainerStyle={styles.contentStyle}>
        {hasItemsForPickUp && (
          <ContainerNotice>
            <NoticePickUpText>
              Gift Options are not available for Pick Up in Store items.
            </NoticePickUpText>
          </ContainerNotice>
        )}
        {cart.items.map((item) => {
          if (!item.isSafeDeleted) {
            return (
              <>
                <CartGiftOptionsItem
                  key={item.id}
                  item={item}
                  handleOptions={handleOptions}
                />
                {cart.items[cart.items.length - 1] !== item && (
                  <Separator key={item.id + 1} />
                )}
              </>
            )
          }
        })}
      </ScrollContainer>
      <Button
        variant="contained"
        isAnchor
        showSpinner={statusGiftApi === RequestStatus.FETCHING}
        onPress={() => {
          sendCartAsGift(cartGiftOptions)
        }}
      >
        Save Gift Options
      </Button>
    </KeyboardAvoidingView>
  )
}

export default connector(CartGiftOptions)
