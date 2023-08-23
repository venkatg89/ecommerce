import React, { useCallback, useContext } from 'react'
import { ActivityIndicator, Linking } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled, { ThemeContext } from 'styled-components/native'
import { SwipeRow } from 'react-native-swipe-list-view'

import Images, { icons } from 'assets/images'
import config from 'config'

import Button from 'src/controls/Button'
import _EnterDiscounts from 'src/components/Cafe/EnterDiscounts'
import _VerifyPhoneNumber from 'src/components/Cafe/VerifyPhoneNumber'

import { navigate, push, Routes } from 'src/helpers/navigationService'
import { CartSummary } from 'src/models/CafeModel/CartModel'
import { PaymentCard } from 'src/models/PaymentModel'
import { RequestStatus } from 'src/models/ApiStatus'
import { paymentCardIconParser, paymentCardType } from 'src/helpers/paymentCard'
import { removeOrderFromCartAction } from 'src/redux/actions/cafe/cartAction'
import {
  checkedInVenueIdSelector,
  getSelectedPaymentCardSelector,
  paymentCardListSelector,
} from 'src/redux/selectors/cafeSelector'
import { cartOrderSummaryApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/cafe'
import { ThemeModel } from 'src/models/ThemeModel'
import { CafeProfileModel } from 'src/models/CafeModel/ProfileModel'
import {
  addEventAction,
  LL_REMOVE_FROM_CAFE_CART,
} from 'src/redux/actions/localytics'

interface ContainerProps {
  flexCenter?: boolean
}

const Container = styled.View<ContainerProps>`
  ${({ flexCenter }) => (flexCenter ? 'flex: 1; justify-content: center;' : '')}
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const OrderContainer = styled.View`
  flex-direction: row;
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  background-color: ${({ theme }) => theme.palette.white};
`

const SwipeableButtonContainer = styled.View`
  flex: 1;
  flex-direction: row;
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  justify-content: flex-end;
`

const RemoveOrderContainer = styled.TouchableOpacity`
  width: ${({ theme }) => theme.spacing(10)};
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.supportingError};
`

const RemoveOrderText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.white};
`

const Flex1 = styled.View`
  flex: 1;
`

const ItemText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
`

const ItemOptionText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: 4;
`

const ItemPriceText = styled.Text`
  min-width: ${({ theme }) => theme.spacing(6)};
  ${({ theme }) => theme.typography.subTitle2}
  color: ${({ theme }) => theme.palette.grey2};
  text-align: right;
`

const FlexRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const SectionHeaderText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const PriceText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const TotalText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding-vertical: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme }) => theme.spacing(3)};
`

const Image = styled.Image`
  height: ${({ theme }) => theme.spacing(25)};
  width: ${({ theme }) => theme.spacing(25)};
  margin-bottom: ${({ theme }) => -theme.spacing(2)};
`

const EmptyOrderText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  text-align: center;
`

const SuggestionText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const AddMoreToOrderButton = styled(Button)`
  min-width: ${({ theme }) => theme.spacing(30)};
  padding: ${({ theme }) => theme.spacing(1.5)}px;
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`

const Divider = styled.View`
  height: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.font.default};
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const DividerGrey = styled.View`
  height: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.grey5};
`

const EnterDiscounts = styled(_EnterDiscounts)`
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const PaymentCardButton = styled(Button)`
  justify-content: flex-start;
`

const CardIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const CardText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color:${({ theme }) => theme.palette.grey2};
  flex: 1;
`

const PaymentActionText = styled.Text`
  ${({ theme }) => theme.typography.button.regular}
  color:${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
`

const AddPaymentCardButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const ViewTermsButton = styled(Button)``

const SectionHeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

const StepContainer = styled.View`
  width: ${({ theme }) => theme.spacing(4)};
`

const CheckboxCircleIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const Flex = styled.View`
  flex: 1;
`

const StepText = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  border-radius: ${({ theme }) => theme.spacing(1.5)};
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.palette.grey1};
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing(0.3)};
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
`

const SectionContentContainer = styled.View`
  margin-left: ${({ theme }) => theme.spacing(4)};
`

const PaymentSectionContainer = styled.View``

const VerifyPhoneNumber = styled(_VerifyPhoneNumber)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

interface OwnProps {
  style?: any
  cart: CartSummary
  cafeProfile: CafeProfileModel | undefined
}

interface StateProps {
  cartOrderSummaryApiRequestStatus: Nullable<RequestStatus>
  venueId?: string
  selectedPaymentCard?: PaymentCard
  cards: PaymentCard[]
}

const selector = createStructuredSelector({
  cartOrderSummaryApiRequestStatus: cartOrderSummaryApiRequestStatusSelector,
  venueId: checkedInVenueIdSelector,
  selectedPaymentCard: getSelectedPaymentCardSelector,
  cards: paymentCardListSelector,
})

interface DispatchProps {
  removeOrderFromCart: (orderId: string) => void
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  removeOrderFromCart: (orderId) =>
    dispatch(removeOrderFromCartAction(orderId)),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps

const CartOrderSummary = ({
  style,
  cart: { items },
  removeOrderFromCart,
  cartOrderSummaryApiRequestStatus,
  venueId,
  selectedPaymentCard,
  cards,
  cafeProfile,
  addEvent,
}: Props) => {
  const subtotalAmount = items
    .map((cartItem) => cartItem.subtotalAmount)
    .reduce((a, b) => a + b, 0)
  const discountAmount = items
    .map((cartItem) => cartItem.discountAmount)
    .reduce((a, b) => a + b, 0)
  const taxAmount = items
    .map((cartItem) => cartItem.taxAmount)
    .reduce((a, b) => a + b, 0)
  const totalAmount = items
    .map((cartItem) => cartItem.totalAmount)
    .reduce((a, b) => a + b, 0)

  const theme = useContext(ThemeContext) as ThemeModel

  const addtoOrder = useCallback(() => {
    if (venueId) {
      navigate(Routes.CAFE__CATEGORIES)
    } else {
      navigate(Routes.CAFE__SEARCH_VENUES)
    }
  }, [venueId])

  const navigateChoosePaymentScreen = useCallback(() => {
    // if we don't have any saved cards, go to add a new one
    if (cards.length) {
      push(Routes.CAFE__CHOOSE_PAYMENT_CARD)
    } else {
      navigate(Routes.CAFE__ADD_PAYMENT_CARD)
    }
  }, [])

  const goToTermsOfSale = useCallback(() => {
    // TODO: wait for PDF version?
    // navigate(Routes.WEBVIEW__PDF, { [Params.PDF_FILE]: PdfFile.CAFE_TERMS_SALE })
    Linking.openURL(config.api.speedetab.termsSalePdf)
  }, [])

  if (!items.length) {
    return (
      <EmptyContainer>
        <Image resizeMode="contain" source={Images.cafe} />
        <EmptyOrderText>Need a pick-me-up?</EmptyOrderText>
        <SuggestionText>
          We've got you covered with coffee, tea, bakery treats, and more.
        </SuggestionText>
        <AddMoreToOrderButton
          variant="contained"
          onPress={addtoOrder}
          size="small"
          center
        >
          START YOUR ORDER
        </AddMoreToOrderButton>
      </EmptyContainer>
    )
  }

  return (
    <Container style={style} flexCenter={!items.length}>
      {items.map((cartOrder) => (
        <SwipeRow
          key={cartOrder.id}
          rightOpenValue={-theme.spacing(12)}
          disableRightSwipe
        >
          <SwipeableButtonContainer>
            <RemoveOrderContainer
              onPress={async () => {
                await removeOrderFromCart(cartOrder.id)
                addEvent(LL_REMOVE_FROM_CAFE_CART, {
                  productTitle: cartOrder.item.name,
                })
              }}
            >
              <RemoveOrderText>Remove</RemoveOrderText>
            </RemoveOrderContainer>
          </SwipeableButtonContainer>
          <OrderContainer>
            <Flex1>
              <ItemText>{ `${cartOrder.item.name}${cartOrder.count > 1 ? ` (x${cartOrder.count})` : ''} ` }</ItemText>
              <ItemOptionText>
                {cartOrder.itemOptions
                  .map((itemOption) => itemOption.name)
                  .join(', ')}
              </ItemOptionText>
            </Flex1>
            <ItemPriceText>
              {`$${(cartOrder.subtotalAmount / 100).toFixed(2)}`}
            </ItemPriceText>
          </OrderContainer>
        </SwipeRow>
      ))}
      <Divider />
      <AddMoreToOrderButton
        variant="contained"
        onPress={() => {
          push(Routes.CAFE__CATEGORIES)
        }}
        size="small"
        center
      >
        Add more to cart
      </AddMoreToOrderButton>

      <DividerGrey />

      <SectionHeaderContainer>
        <StepContainer>
          {!cafeProfile?.isVerified ? (
            <StepText>1</StepText>
          ) : (
            <CheckboxCircleIcon source={icons.checkboxCheckedCircle} />
          )}
        </StepContainer>
        <TitleText>Verify Your Phone Number</TitleText>
        <Flex />
      </SectionHeaderContainer>
      <SectionContentContainer>
        <VerifyPhoneNumber cafeProfile={cafeProfile} />
      </SectionContentContainer>
      <DividerGrey />

      <SectionHeaderContainer>
        <StepContainer>
          <StepText>2</StepText>
        </StepContainer>
        <TitleText>Payment Details</TitleText>
        <Flex />
      </SectionHeaderContainer>
      { cafeProfile?.isVerified && (
        <PaymentSectionContainer>
          {selectedPaymentCard ? (
            <PaymentCardButton
              onPress={navigateChoosePaymentScreen}
              maxWidth
              icon
            >
              <CardIcon
                source={paymentCardIconParser(selectedPaymentCard.type)}
              />
              <CardText>{`${paymentCardType(selectedPaymentCard.type)} *${
                selectedPaymentCard.lastFourDigits
              }`}</CardText>
              <PaymentActionText>Edit</PaymentActionText>
            </PaymentCardButton>
          ) : (
            <AddPaymentCardButton
              variant="outlined"
              onPress={navigateChoosePaymentScreen}
              center
              maxWidth
              linkGreen
            >
              + Add Payment Method
            </AddPaymentCardButton>
          )}

          {(!!items.length && <EnterDiscounts otherDiscountsVisible={true} cafeProfile={ cafeProfile }/>) || undefined}
        </PaymentSectionContainer>
      ) }

      <DividerGrey />

      <SectionHeaderText>Order Summary</SectionHeaderText>
      {cartOrderSummaryApiRequestStatus === RequestStatus.FETCHING ? (
        <ActivityIndicator size="small" />
      ) : (
        <React.Fragment>
          <FlexRow>
            <PriceText>Subtotal</PriceText>
            <PriceText>
              {subtotalAmount ? `$${(subtotalAmount / 100).toFixed(2)}` : '-'}
            </PriceText>
          </FlexRow>
          <FlexRow>
            <PriceText>Discounts</PriceText>
            <PriceText>
              {discountAmount ? `$${(discountAmount / 100).toFixed(2)}` : '-'}
            </PriceText>
          </FlexRow>
          <FlexRow>
            <PriceText>Tax</PriceText>
            <PriceText>
              {taxAmount ? `$${(taxAmount / 100).toFixed(2)}` : '-'}
            </PriceText>
          </FlexRow>
          <FlexRow>
            <TotalText>Order Total</TotalText>
            <TotalText>
              {totalAmount ? `$${(totalAmount / 100).toFixed(2)}` : '-'}
            </TotalText>
          </FlexRow>
        </React.Fragment>
      )}
      <Divider />
      <ViewTermsButton
        size="small"
        overrideTextStyle={{
          textTransform: 'none',
          textDecorationLine: 'underline',
          fontSize: 12,
        }}
        onPress={goToTermsOfSale}
      >
        View terms of sales
      </ViewTermsButton>
    </Container>
  )
}

export default connector(CartOrderSummary)
