import React from 'react'
import styled from 'styled-components/native'

import countLabelText from 'src/helpers/countLabelText'

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

export interface OrderSummary {
  itemCount: number
  subtotal: number
  discountAmount: number
  giftWrapAmount: number
  shippingAmount: number
  pickUpInStore: boolean
  taxAmount: number
  total: number
}

interface Props {
  orderSummary: OrderSummary
}

const SubmittedOrderSummary = ({ orderSummary }: Props) => {
  return (
    <Container>
      <SummaryContainer>
        <StoreContainer>
          <TitleContainer>
            <OrderSummaryText ignoreTextTransform>{`Subtotal (${countLabelText(
              orderSummary.itemCount,
              'item',
              'items',
            )})`}</OrderSummaryText>
            <OrderSummaryText numberOfLines={1}>
              ${orderSummary ? orderSummary.subtotal.toFixed(2) : 0}
            </OrderSummaryText>
          </TitleContainer>
          {!!orderSummary && !!orderSummary.discountAmount && (
            <TitleContainer>
              <OrderSummaryText>Discounts</OrderSummaryText>
              <OrderSummaryText numberOfLines={1}>
                -$
                {orderSummary
                  ? Math.abs(orderSummary.discountAmount).toFixed(2)
                  : 0}
              </OrderSummaryText>
            </TitleContainer>
          )}
          {!!orderSummary && !!orderSummary.giftWrapAmount && (
            <TitleContainer>
              <OrderSummaryText>Gift Wraps</OrderSummaryText>
              <OrderSummaryText numberOfLines={1}>
                ${orderSummary ? orderSummary.giftWrapAmount.toFixed(2) : 0}
              </OrderSummaryText>
            </TitleContainer>
          )}
          <TitleContainer>
            <OrderSummaryText>Estimated Shipping</OrderSummaryText>
            <OrderSummaryText numberOfLines={1}>
              ${orderSummary ? orderSummary.shippingAmount.toFixed(2) : 0}
            </OrderSummaryText>
          </TitleContainer>
          {!!orderSummary && !!orderSummary.pickUpInStore && (
            <TitleContainer>
              <OrderSummaryText ignoreTextTransform>
                Pick up in Store
              </OrderSummaryText>
              <OrderSummaryText>FREE</OrderSummaryText>
            </TitleContainer>
          )}

          <TitleContainer>
            <OrderSummaryText>Estimated Tax</OrderSummaryText>
            <OrderSummaryText numberOfLines={1}>
              ${orderSummary ? orderSummary.taxAmount.toFixed(2) : 0}
            </OrderSummaryText>
          </TitleContainer>
          <TitleContainer>
            <NameText>Order Total</NameText>
            <NameText>
              ${orderSummary ? orderSummary.total.toFixed(2) : 0}
            </NameText>
          </TitleContainer>
        </StoreContainer>
      </SummaryContainer>
    </Container>
  )
}

export default SubmittedOrderSummary
