import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'

import DeliveryOptions from 'src/components/Cart/Checkout/DeliveryOptions'
import PaymentDetails from 'src/components/Cart/Checkout/PaymentDetails'
import ReviewSubmit from 'src/components/Cart/Checkout/Review_Submit'
import Button from 'src/controls/Button'
import styled from 'styled-components/native'
import OrderSummary from 'src/components/Cart/Checkout/OrderSummary'
import { reset, Routes } from 'src/helpers/navigationService'
import { NavigationActions } from 'react-navigation'
import Alert from 'src/controls/Modal/Alert'

import { createStructuredSelector } from 'reselect'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import {
  accountEmailSelector,
  myAtgAccountSelector,
} from 'src/redux/selectors/userSelector'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import {
  commitOrder,
  isCvvRequired,
  subscribeToMarketingEmails,
} from 'src/endpoints/atgGateway/cart'
import {
  addressDetailsSelector,
  shopCartSelector,
  cartOrderSummarySelector,
} from 'src/redux/selectors/shopSelector'
import {
  SelectShippingAddressRequest,
  ShippingAddress,
  ShopCartModel,
} from 'src/models/ShopModel/CartModel'
import {
  addressDetailsAction,
  refreshCartWithNewPriceAction,
  selectShippingAddressAction,
  orderClearAction,
} from 'src/redux/actions/shop/cartAction'
import { ShopOrderSummaryModel } from 'src/models/ShopModel/CheckoutModel'
import CartShippingAddress from 'src/components/Cart/Checkout/ShippingAddress'
import {
  addEventAction,
  LL_CHECKOUT_COMPLETED,
  LL_ITEM_PURCHASED,
} from 'src/redux/actions/localytics'

const Container = styled.View`
  background-color: #fafafa;
  margin-bottom: ${({ theme }) => theme.spacing(18)};
`

const HeaderTitle = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: #21282d;
  font-size: 24;
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
`
const ScrollContainer = styled.ScrollView``

const Divider = styled.View`
  border-bottom-width: 1;
  border-bottom-color: #c2cbd1;
`

const FooterContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-left: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(2.5)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  margin-right: ${({ theme }) => theme.spacing(4)};
`

const PlaceOrderButton = styled(Button)`
  padding-horizontal: ${({ theme }) => theme.spacing(4)};
  padding-vertical: ${({ theme }) => theme.spacing(2)};
`

const PriceContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(2.5)};
`

const PriceText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-right: ${({ theme }) => theme.spacing(2.5)};
`
const PriceTotal = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  font-family: Lato-Bold;
  font-size: 16;
`

interface StateProps {
  atgAccount?: AtgAccountModel
  cart: ShopCartModel
  addressList?: ShippingAddress[]
  orderSummary: Nullable<ShopOrderSummaryModel>
  userEmail: string
}

const selector = createStructuredSelector<any, StateProps>({
  cart: shopCartSelector,
  atgAccount: myAtgAccountSelector,
  addressList: addressDetailsSelector,
  orderSummary: cartOrderSummarySelector,
  userEmail: accountEmailSelector,
})

interface DispatchProps {
  getAddressDetails: (profileId: string) => void
  selectShippingAddress: (request: SelectShippingAddressRequest) => void
  refreshCart: () => void
  addEvent: (name, attributes) => void
  orderCompleted: () => void
}

const dispatcher = (dispatch) => ({
  getAddressDetails: (profileId: string) =>
    dispatch(addressDetailsAction(profileId)),
  selectShippingAddress: (request: SelectShippingAddressRequest) =>
    dispatch(selectShippingAddressAction(request)),
  refreshCart: () => dispatch(refreshCartWithNewPriceAction()),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
  orderCompleted: () => dispatch(orderClearAction()),
})

type Props = StateProps & DispatchProps & NavigationInjectedProps

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

export const getSelectedIndex = (addressList) => {
  const index = addressList?.findIndex((ele) => ele.defaultAddress)
  return index !== -1 ? index : 0
}

export enum CheckoutStepState {
  PENDING = 'pending',
  EDIT = 'edit',
  COMPLETE = 'complete',
}

export enum CheckoutStep {
  SHIPPING_ADDRESS = 1,
  DELIVERY_OPTIONS = 2,
  PAYMENT = 3,
  REVIEW = 4,
}

const CartCheckoutScreen = ({
  atgAccount,
  addressList = [],
  getAddressDetails,
  selectShippingAddress,
  cart,
  orderSummary,
  navigation,
  refreshCart,
  addEvent,
  userEmail,
  orderCompleted,
}: Props) => {
  const [emailOptedIn, setEmailOptedIn] = useState(false)
  const [reloadValue, setReloadValue] = useState(1)
  const [cvvModal, setCvvModal] = useState(false)
  const [commitErrorsModal, setCommitErrorsModal] = useState(false)
  const [commitErrors, setCommitErrors] = useState('')
  const [cvv, setCvv] = useState('')
  const [sendingOrder, setSendingOrder] = useState(false)
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(
    getSelectedIndex(addressList),
  )
  const orderId = navigation.getParam('orderId')

  const showAddress = useCallback(() => {
    return cart.items.some((item) => item.shipItem)
  }, [cart.items])

  // TODO shippingAddressStep & paymentStep
  /* @ts-ignore */
  const [
    shippingAddressStep,
    setShippingAddressStep,
  ] = useState<CheckoutStepState>(
    showAddress() ? CheckoutStepState.EDIT : CheckoutStepState.COMPLETE,
  )
  const [
    deliveryOptionStep,
    setDeliveryOptionStep,
  ] = useState<CheckoutStepState>(
    atgAccount ? CheckoutStepState.COMPLETE : CheckoutStepState.EDIT,
  ) //if we're logged in, we always have the default delivery option picked
  /* @ts-ignore */
  const [paymentStep, setPaymentStep] = useState<CheckoutStepState>( // eslint-disable-line
    CheckoutStepState.EDIT,
  )

  const addressCallback = useCallback(async () => {
    if (atgAccount) {
      await getAddressDetails(atgAccount?.atgUserId || '')
      const defaultAddressIndex = addressList?.findIndex(
        (address) => address.defaultAddress === true,
      )
      setSelectedAddressIndex(
        defaultAddressIndex !== -1 ? defaultAddressIndex : 0,
      )
      if (defaultAddressIndex !== -1) {
        setShippingAddressStep(CheckoutStepState.COMPLETE)
      }
    }
  }, [addressList])

  const determineStep = (step: CheckoutStep): CheckoutStepState => {
    // cascading states
    switch (step) {
      case CheckoutStep.SHIPPING_ADDRESS: {
        return shippingAddressStep
      }
      case CheckoutStep.DELIVERY_OPTIONS: {
        if (shippingAddressStep === CheckoutStepState.COMPLETE) {
          return deliveryOptionStep
        } else {
          return CheckoutStepState.PENDING
        }
      }
      case CheckoutStep.PAYMENT: {
        if (
          shippingAddressStep === CheckoutStepState.COMPLETE &&
          deliveryOptionStep === CheckoutStepState.COMPLETE
        ) {
          return paymentStep
        } else {
          return CheckoutStepState.PENDING
        }
      }
      case CheckoutStep.REVIEW: {
        if (
          shippingAddressStep === CheckoutStepState.COMPLETE &&
          deliveryOptionStep === CheckoutStepState.COMPLETE &&
          paymentStep === CheckoutStepState.COMPLETE
        ) {
          return CheckoutStepState.COMPLETE
        } else {
          return CheckoutStepState.PENDING
        }
      }
      default: {
        return CheckoutStepState.PENDING
      }
    }
  }

  useEffect(() => {
    addressCallback()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(addressCallback, 1000)
    return () => clearTimeout(timeout)
  }, [reloadValue])

  const sendOrder = async () => {
    setCommitErrors('')
    setSendingOrder(true)
    const commitResult = await commitOrder({ orderId: orderId, cvv })
    if (emailOptedIn && userEmail && !atgAccount) {
      subscribeToMarketingEmails(userEmail)
    }
    setCvv('')
    setCvvModal(false)
    if (commitResult.ok && commitResult.data.response.success) {
      const orderId = commitResult.data.BNOrderId
      if (orderId) {
        // reset cart
        await orderCompleted()
        setSendingOrder(false)
        reset(1, [
          NavigationActions.navigate({ routeName: Routes.CART__MAIN }),
          NavigationActions.navigate({
            routeName: Routes.CART__ORDERS,
            params: { orderId: orderId },
          }),
        ])
        cart.items.map((item) => {
          const itemPurchased = {
            qty: item.quantity,
            price: item.salePrice,
            productFormat: item.parentFormat,
            productTitle: item.displayName,
            productId: item.ean,
            bopis: !item.shipItem,
          }
          addEvent(LL_ITEM_PURCHASED, itemPurchased)
        })

        const usingMemberships =
          atgAccount?.membership?.bnMembership ||
          atgAccount?.membership?.educator ||
          atgAccount?.membership?.employee ||
          atgAccount?.membership?.kidsClub

        const giftCard =
          orderSummary &&
          Object.keys(orderSummary.appliedGiftCardDetails).length > 0
            ? 'yes'
            : 'no'

        const checkoutCompleted = {
          qty: commitResult.data.order.commerceItemCount,
          orderTotal: commitResult.data.order?.priceInfo?.total,
          gift: commitResult.data.order?.commerceItems.some(
            (item) => !!item.giftItem,
          )
            ? 'yes'
            : 'no',
          giftCard: giftCard,
          coupon: orderSummary?.discountAmount ? 'yes' : 'no',
          membershipLinked: usingMemberships ? 'yes' : 'no',
        }

        addEvent(LL_CHECKOUT_COMPLETED, checkoutCompleted)
      } else {
        setCommitErrors(
          'Something went wrong with the order, please try again later!',
        )
        setCommitErrorsModal(true)
      }
    } else {
      if (commitResult.data.response.message) {
        setSendingOrder(false)
        setCommitErrors(commitResult.data.response.message)
        setCommitErrorsModal(true)
      } else if (commitResult.data.formError) {
        setSendingOrder(false)
        const errors = commitResult.data.formExceptions
          .map((exception) => exception.localizedMessage)
          .reduce((a, b) => a + ' ' + b, '')
        setCommitErrors(errors)
        setCommitErrorsModal(true)
      }
    }
  }

  const isCvvNeeded = async () => {
    const cvvResult = await isCvvRequired({ orderId: orderId })
    if (cvvResult.data) {
      const { cvvRequired } = cvvResult.data
      if (cvvRequired === 'true') {
        setCvvModal(true)
      } else {
        sendOrder()
        setCvvModal(false)
      }
    }
  }

  const showDiscounts = determineStep(CheckoutStep.PAYMENT) === CheckoutStepState.EDIT

  return (
    <>
      <Container>
        <HeaderTitle>Checkout</HeaderTitle>
        <ScrollContainer>
          {showAddress() && (
            <CartShippingAddress
              reloadValue={reloadValue}
              setReloadValue={setReloadValue}
              selectedAddressIndex={selectedAddressIndex}
              setSelectedAddressIndex={setSelectedAddressIndex}
              stepState={determineStep(CheckoutStep.SHIPPING_ADDRESS)}
              setStepState={setShippingAddressStep}
              addressList={addressList}
              selectShippingAddress={selectShippingAddress}
              isGuest={!!atgAccount ? false : true}
            />
          )}

          <Divider />
          <DeliveryOptions
            step={showAddress() ? 2 : 1}
            cart={cart}
            stepState={determineStep(CheckoutStep.DELIVERY_OPTIONS)}
            setStepState={setDeliveryOptionStep}
          />
          <Divider />
          <PaymentDetails
            step={showAddress() ? 3 : 2}
            shippingAddress={
              addressList && addressList.length > selectedAddressIndex
                ? addressList[selectedAddressIndex]
                : undefined
            }
            isOptedIn={emailOptedIn}
            toggleOptedIn={() => setEmailOptedIn(!emailOptedIn)}
            stepState={determineStep(CheckoutStep.PAYMENT)}
            setStepState={setPaymentStep}
            showDiscounts={showDiscounts}
          />
          <Divider />
          <ReviewSubmit
            step={showAddress() ? 4 : 3}
            displayInfo={
              determineStep(CheckoutStep.REVIEW) === CheckoutStepState.COMPLETE
            }
          />
          <Divider />

          <OrderSummary
            cart={cart}
            stepState={determineStep(CheckoutStep.REVIEW)}
          />
          <Divider />
        </ScrollContainer>
        <FooterContainer>
          <PlaceOrderButton
            variant="contained"
            disabled={
              determineStep(CheckoutStep.REVIEW) !== CheckoutStepState.COMPLETE
            }
            onPress={async () => {
              await isCvvNeeded()
            }}
            showSpinner={sendingOrder}
          >
            Place order
          </PlaceOrderButton>
          <PriceContainer>
            <PriceText>Total:</PriceText>
            <PriceTotal>
              ${orderSummary ? orderSummary.total.toFixed(2) : 0}
            </PriceTotal>
          </PriceContainer>
        </FooterContainer>
      </Container>
      <Alert
        isOpen={cvvModal}
        title={'Verify Credit Card Security Code'}
        description="For security purposes, please verify your CVV"
        customBody={
          <>
            <BodyText>For security purposes, please verify your CVV</BodyText>
            <Input
              placeholder="Security Code"
              onChangeText={(value) => setCvv(value)}
            />
          </>
        }
        buttons={[
          {
            title: 'CONFIRM AND CONTINUE',
            onPress: () => {
              sendOrder()
            },
          },
        ]}
        onDismiss={() => {
          setCvv('')
          setCvvModal(false)
        }}
        cancelText="Cancel"
      />
      <Alert
        isOpen={commitErrorsModal}
        title="Something went wrong with the order"
        description={commitErrors}
        onDismiss={() => {
          setCommitErrors('')
          setCommitErrorsModal(false)
        }}
        cancelText="OK"
      />
    </>
  )
}

export default withNavigation(connector(CartCheckoutScreen))
const Input = styled.TextInput`
  font-size: 13;
  color: ${({ theme }) => theme.font.default};
  background: white;
  padding: 4px 8px 4px 8px;
  margin-bottom: 4;
  border: 1px grey solid;
  width: 100%;
  height: ${({ theme }) => theme.spacing(4)};
`
const BodyText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`
