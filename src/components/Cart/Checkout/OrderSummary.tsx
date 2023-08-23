import React from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { CheckoutStepState } from 'src/screens/cart/Checkout'

import { ShopCartModel } from 'src/models/ShopModel/CartModel'
import { ShopOrderSummaryModel } from 'src/models/ShopModel/CheckoutModel'
import countLabelText from 'src/helpers/countLabelText'
import { cartOrderSummarySelector } from 'src/redux/selectors/shopSelector'

const Container = styled.View`
  position: relative;
  background-color: #fafafa;
`
const SummaryContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(4)};
  margin-left: ${({ theme }) => theme.spacing(0.5)};
  margin-right: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const StoreContainer = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(1.5)};
`

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  line-height: 18;
  letter-spacing: 0.4;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`

const OrderSummaryText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  line-height: 16;
  letter-spacing: 0.4;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  ${({ ignoreTextTransform }) =>
    ignoreTextTransform ? '' : 'text-transform: capitalize;'}
`

interface OwnProps {
  cart: ShopCartModel
  stepState?: CheckoutStepState
}

interface StateProps {
  orderSummary: Nullable<ShopOrderSummaryModel>
}

const selector = createStructuredSelector<any, StateProps>({
  orderSummary: cartOrderSummarySelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const OrderSummary = ({ cart, stepState, orderSummary }: Props) => {
  // const [isLoading, setIsLoading] = useState<boolean>(true) // TODO: add loading spinner?

  if (stepState === CheckoutStepState.PENDING) {
    return <Container />
  }

  const giftCardAmount =
    (orderSummary &&
      Object.values(orderSummary.appliedGiftCardDetails).reduce(
        (total, amount) => total + amount,
        0,
      )) ||
    0

  return (
    <Container>
      <SummaryContainer>
        <StoreContainer>
          <TitleContainer>
            <OrderSummaryText ignoreTextTransform>{`Subtotal (${countLabelText(
              cart.itemCount,
              'item',
              'items',
            )})`}</OrderSummaryText>
            <OrderSummaryText numberOfLines={ 1 }>
              ${orderSummary ? orderSummary.subtotal.toFixed(2) : 0}
            </OrderSummaryText>
          </TitleContainer>
          {!!orderSummary && !!orderSummary.discountAmount && (
            <TitleContainer>
              <OrderSummaryText>Discounts</OrderSummaryText>
              <OrderSummaryText numberOfLines={ 1 }>
                -${orderSummary ? orderSummary.discountAmount.toFixed(2) : 0}
              </OrderSummaryText>
            </TitleContainer>
          )}
          {!!orderSummary && !!orderSummary.giftWrapAmount && (
            <TitleContainer>
              <OrderSummaryText>Gift Wraps</OrderSummaryText>
              <OrderSummaryText numberOfLines={ 1 }>
                ${orderSummary ? orderSummary.giftWrapAmount.toFixed(2) : 0}
              </OrderSummaryText>
            </TitleContainer>
          )}
          <TitleContainer>
            <OrderSummaryText>Estimated Shipping</OrderSummaryText>
            <OrderSummaryText numberOfLines={ 1 }>
              ${orderSummary ? orderSummary.shippingAmount.toFixed(2) : 0}
            </OrderSummaryText>
          </TitleContainer>
          {!!orderSummary && !!orderSummary.pickUpInStore && (
            <TitleContainer>
              <OrderSummaryText ignoreTextTransform>
                Pick up in Store
              </OrderSummaryText>
              <OrderSummaryText>{orderSummary.pickUpInStore}</OrderSummaryText>
            </TitleContainer>
          )}

          <TitleContainer>
            <OrderSummaryText>Estimated Tax</OrderSummaryText>
            <OrderSummaryText numberOfLines={ 1 }>
              ${orderSummary ? orderSummary.taxAmount.toFixed(2) : 0}
            </OrderSummaryText>
          </TitleContainer>
          {!!giftCardAmount && (
            <TitleContainer>
              <OrderSummaryText ignoreTextTransform>
                BN Gift Cards
              </OrderSummaryText>
              <OrderSummaryText numberOfLines={ 1 }>
                -${giftCardAmount.toFixed(2)}
              </OrderSummaryText>
            </TitleContainer>
          )}
          <TitleContainer>
            <NameText>Order Total</NameText>
            <NameText numberOfLines={1}>
              ${orderSummary ? orderSummary.total.toFixed(2) : 0}
            </NameText>
          </TitleContainer>
        </StoreContainer>
      </SummaryContainer>
    </Container>
  )
}

export default connector(OrderSummary)
