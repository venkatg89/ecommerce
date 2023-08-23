import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import countLabelText from 'src/helpers/countLabelText'
import BookImage from 'src/components/BookImage'
import EnterDiscounts from '../EnterDiscounts'
import { toDayCommaMonthDay } from 'src/helpers/dateFormatters'
import { parseDate } from 'src/helpers/dateParser'
import { push, Routes } from 'src/helpers/navigationService'
import { ShopCartItemModel } from 'src/models/ShopModel/CartModel'
import { ShopCartState } from 'src/redux/reducers/ShopReducer/CartReducer'
import { shopCartSelector } from 'src/redux/selectors/shopSelector'
import styled from 'styled-components/native'

const Container = styled.View`
  background-color: #fafafa;
`
const ReviewSubmitContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(2.5)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const StoreContainer = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const SectionTitleContainer = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(1)};
`

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const TitleContainer1 = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const ReviewBodyContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`

const HeaderSubTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const EsimatedArrivalText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const SubBodyContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(2.5)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const EditButton = styled.Text`
  ${({ theme }) => theme.typography.button.small};
  color: ${({ theme }) => theme.palette.linkGreen};
  padding-horizontal: ${({ theme }) => theme.spacing(1)};
  margin-left: ${({ theme }) => theme.spacing(4)};
`

const ReviewSubmitDescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const ReviewSubmitSalePriceDescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
`

const ReviewSubmitHardCoverDescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const RowContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const MarginBodyContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const ReviewNumberText = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  border-radius: 13;
  height: 26;
  width: 26;
  border: 1px solid #000000;
  padding-top: ${({ theme }) => theme.spacing(0.3)};
  text-align: center;
`

const SectionTitleText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
`

const ReviewSubmitDescriptionTextBeforeDiscount = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey3};
  text-decoration: line-through;
  margin-left: ${({ theme }) => theme.spacing(1)};
`

interface StateProps {
  cart: ShopCartState
}

interface OwnProps {
  displayInfo: boolean
  step: number
}

type Props = OwnProps & StateProps

const selector = createStructuredSelector<any, StateProps>({
  cart: shopCartSelector,
})

const getItems = (shippingRelationship, group) => {
  let items: string[] = []
  if (group) {
    const groupId = group.id
    const shippingRelationshipItems = shippingRelationship.filter(
      (relationship) => relationship.shippingGroupId === groupId,
    )
    if (shippingRelationshipItems && shippingRelationshipItems.length > 0) {
      items = shippingRelationshipItems.map((item) => item.commerceItemId)
    }
  }
  return items
}

const connector = connect<StateProps, {}, {}>(selector)

const ITEM_GOUP_TO_BE_DELIVERED_ELECTRONICALLY = 'electronicShippingGroup'
const ITEM_GOUP_TO_BE_PICKED_UP = 'bopisHardgoodShippingGroup'

const ReviewSubmit = ({ cart, displayInfo, step }: Props) => {
  let itemsToBeDelivered: ShopCartItemModel[] = []
  let itemsToBeDeliveredElectronically: ShopCartItemModel[] = []
  let itemsToBePickedUp: ShopCartItemModel[] = []

  const shippingGroups = cart.shippingGroups
  const shippingRelationship = cart.shippingRelationship
  const cartItems = cart.items

  const groupToBeDeliveredElectronically = shippingGroups?.find(
    (group) =>
      group.shippingGroupType === ITEM_GOUP_TO_BE_DELIVERED_ELECTRONICALLY,
  )
  const groupToBePickedUp = shippingGroups?.find(
    (group) => group.shippingGroupType === ITEM_GOUP_TO_BE_PICKED_UP,
  )

  const shippingRelationshipItemsToBeDeliveredElectronically = getItems(
    shippingRelationship,
    groupToBeDeliveredElectronically,
  )
  const shippingRelationshipItemsToBePickedUp = getItems(
    shippingRelationship,
    groupToBePickedUp,
  )

  cartItems.forEach((item) => {
    if (
      shippingRelationshipItemsToBeDeliveredElectronically.includes(item.id)
    ) {
      itemsToBeDeliveredElectronically.push(item)
    } else if (shippingRelationshipItemsToBePickedUp.includes(item.id)) {
      itemsToBePickedUp.push(item)
    } else {
      itemsToBeDelivered.push(item)
    }
  })

  if (!displayInfo) {
    return (
      <ReviewSubmitContainer>
        <ReviewNumberText>{step}</ReviewNumberText>
        <SectionTitleContainer>
          <TitleContainer>
            <SectionTitleText>Review & Submit</SectionTitleText>
          </TitleContainer>
        </SectionTitleContainer>
      </ReviewSubmitContainer>
    )
  }

  return (
    <Container>
      <ReviewSubmitContainer>
        <ReviewNumberText>{step}</ReviewNumberText>
        <StoreContainer>
          <TitleContainer>
            <NameText>Review & Submit</NameText>
          </TitleContainer>
        </StoreContainer>
      </ReviewSubmitContainer>
      <ReviewBodyContainer>
        {itemsToBeDeliveredElectronically.length > 0 && (
          <>
            <HeaderSubTitle>
              {countLabelText(
                itemsToBeDeliveredElectronically.length,
                'item',
                'items',
              )}{' '}
              to be delivered electronically
            </HeaderSubTitle>
            {itemsToBeDeliveredElectronically.map((item) => (
              <SubBodyContainer key={item.id}>
                <BookImage size="medium" bookOrEan={item.ean} />
                <StoreContainer>
                  <MarginBodyContainer>
                    <NameText>{item.displayName}</NameText>
                    <ReviewSubmitDescriptionText>
                      {item.displayAuthor}
                    </ReviewSubmitDescriptionText>
                  </MarginBodyContainer>
                  {item.salePrice && item.unitAmount !== item.salePrice ? (
                    <RowContainer>
                      <ReviewSubmitSalePriceDescriptionText>
                        ${item.unitAmount.toFixed(2)}
                      </ReviewSubmitSalePriceDescriptionText>
                      <ReviewSubmitDescriptionTextBeforeDiscount>
                        ${item.salePrice.toFixed(2)}
                      </ReviewSubmitDescriptionTextBeforeDiscount>
                      <ReviewSubmitHardCoverDescriptionText>
                        {item.parentFormat}
                      </ReviewSubmitHardCoverDescriptionText>
                    </RowContainer>
                  ) : (
                    <RowContainer>
                      <ReviewSubmitSalePriceDescriptionText>
                        ${item.salePrice.toFixed(2)}
                      </ReviewSubmitSalePriceDescriptionText>
                      <ReviewSubmitHardCoverDescriptionText>
                        {item.parentFormat}
                      </ReviewSubmitHardCoverDescriptionText>
                    </RowContainer>
                  )}
                  {item.discounted && (
                    <MarginBodyContainer>
                      <ReviewSubmitDescriptionText>
                        Discount {item.discountAmount}% applied
                      </ReviewSubmitDescriptionText>
                    </MarginBodyContainer>
                  )}
                  <MarginBodyContainer>
                    <ReviewSubmitDescriptionText>
                      Qty: {item.quantity}
                    </ReviewSubmitDescriptionText>
                  </MarginBodyContainer>
                  <ReviewSubmitDescriptionText>
                    Estimated Arrival Date
                  </ReviewSubmitDescriptionText>
                  <EsimatedArrivalText>
                    {toDayCommaMonthDay(
                      parseDate(item.deliveryPromiseDate, 'YYYYMMDD'),
                    )}
                  </EsimatedArrivalText>
                  <TitleContainer1>
                    <ReviewSubmitDescriptionText>
                      Want to pickup?
                    </ReviewSubmitDescriptionText>
                    <EditButton
                      onPress={() => {
                        push(Routes.CART__MAIN)
                      }}
                    >
                      EDIT CART
                    </EditButton>
                  </TitleContainer1>
                </StoreContainer>
              </SubBodyContainer>
            ))}
          </>
        )}
        {itemsToBeDelivered.length > 0 && (
          <>
            <HeaderSubTitle>
              {countLabelText(itemsToBeDelivered.length, 'item', 'items')} to be
              delivered
            </HeaderSubTitle>
            {itemsToBeDelivered.map((item) => (
              <SubBodyContainer key={item.id}>
                <BookImage size="medium" bookOrEan={item.ean} />
                <StoreContainer>
                  <MarginBodyContainer>
                    <NameText>{item.displayName}</NameText>
                    <ReviewSubmitDescriptionText>
                      {item.displayAuthor}
                    </ReviewSubmitDescriptionText>
                  </MarginBodyContainer>
                  {item.salePrice && item.unitAmount !== item.salePrice ? (
                    <RowContainer>
                      <ReviewSubmitSalePriceDescriptionText>
                        ${item.unitAmount.toFixed(2)}
                      </ReviewSubmitSalePriceDescriptionText>
                      <ReviewSubmitDescriptionTextBeforeDiscount>
                        ${item.salePrice.toFixed(2)}
                      </ReviewSubmitDescriptionTextBeforeDiscount>
                      <ReviewSubmitHardCoverDescriptionText>
                        {item.parentFormat}
                      </ReviewSubmitHardCoverDescriptionText>
                    </RowContainer>
                  ) : (
                    <RowContainer>
                      <ReviewSubmitSalePriceDescriptionText>
                        ${item.salePrice.toFixed(2)}
                      </ReviewSubmitSalePriceDescriptionText>
                      <ReviewSubmitHardCoverDescriptionText>
                        {item.parentFormat}
                      </ReviewSubmitHardCoverDescriptionText>
                    </RowContainer>
                  )}
                  {item.discounted && (
                    <MarginBodyContainer>
                      <ReviewSubmitDescriptionText>
                        Discount {item.discountAmount}% applied
                      </ReviewSubmitDescriptionText>
                    </MarginBodyContainer>
                  )}
                  <MarginBodyContainer>
                    <ReviewSubmitDescriptionText>
                      Qty: {item.quantity}
                    </ReviewSubmitDescriptionText>
                  </MarginBodyContainer>
                  <ReviewSubmitDescriptionText>
                    Estimated Arrival Date
                  </ReviewSubmitDescriptionText>
                  <EsimatedArrivalText>
                    {toDayCommaMonthDay(
                      parseDate(item.deliveryPromiseDate, 'YYYYMMDD'),
                    )}
                  </EsimatedArrivalText>
                  <TitleContainer1>
                    <ReviewSubmitDescriptionText>
                      Want to pickup?
                    </ReviewSubmitDescriptionText>
                    <EditButton
                      onPress={() => {
                        push(Routes.CART__MAIN)
                      }}
                    >
                      EDIT CART
                    </EditButton>
                  </TitleContainer1>
                </StoreContainer>
              </SubBodyContainer>
            ))}
          </>
        )}
        {itemsToBePickedUp.length > 0 && (
          <>
            <HeaderSubTitle>
              {countLabelText(itemsToBePickedUp.length, 'item', 'items')} to be
              picked up in store
            </HeaderSubTitle>
            {itemsToBePickedUp.map((item) => (
              <SubBodyContainer key={item.id}>
                <BookImage size="medium" bookOrEan={item.ean} />
                <StoreContainer>
                  <MarginBodyContainer>
                    <NameText>{item.displayName}</NameText>
                    <ReviewSubmitDescriptionText>
                      {item.displayAuthor}
                    </ReviewSubmitDescriptionText>
                  </MarginBodyContainer>
                  {item.salePrice && item.unitAmount !== item.salePrice ? (
                    <RowContainer>
                      <ReviewSubmitSalePriceDescriptionText>
                        ${item.unitAmount.toFixed(2)}
                      </ReviewSubmitSalePriceDescriptionText>
                      <ReviewSubmitDescriptionTextBeforeDiscount>
                        ${item.salePrice.toFixed(2)}
                      </ReviewSubmitDescriptionTextBeforeDiscount>
                      <ReviewSubmitHardCoverDescriptionText>
                        {item.parentFormat}
                      </ReviewSubmitHardCoverDescriptionText>
                    </RowContainer>
                  ) : (
                    <RowContainer>
                      <ReviewSubmitSalePriceDescriptionText>
                        ${item.salePrice.toFixed(2)}
                      </ReviewSubmitSalePriceDescriptionText>
                      <ReviewSubmitHardCoverDescriptionText>
                        {item.parentFormat}
                      </ReviewSubmitHardCoverDescriptionText>
                    </RowContainer>
                  )}
                  {item.discounted && (
                    <MarginBodyContainer>
                      <ReviewSubmitDescriptionText>
                        Discount {item.discountAmount}% applied
                      </ReviewSubmitDescriptionText>
                    </MarginBodyContainer>
                  )}
                  <MarginBodyContainer>
                    <ReviewSubmitDescriptionText>
                      Qty: {item.quantity}
                    </ReviewSubmitDescriptionText>
                  </MarginBodyContainer>
                  <TitleContainer1>
                    <ReviewSubmitDescriptionText>
                      Want to ship instead?
                    </ReviewSubmitDescriptionText>
                    <EditButton
                      onPress={() => {
                        push(Routes.CART__MAIN)
                      }}
                    >
                      EDIT CART
                    </EditButton>
                  </TitleContainer1>
                </StoreContainer>
              </SubBodyContainer>
            ))}
          </>
        )}
      </ReviewBodyContainer>
      <EnterDiscounts otherDiscountsVisible={true} />
    </Container>
  )
}

export default connector(ReviewSubmit)
