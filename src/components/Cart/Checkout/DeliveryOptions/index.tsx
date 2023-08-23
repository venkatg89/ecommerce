import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { icons } from 'assets/images'
import Button from 'src/controls/Button'

import ChangeDelieveryOptionList from './ChangeDelieveryOptionList'
import DelieveryOptionList from './DelieveryOptionList'
import { CheckoutStepState } from 'src/screens/cart/Checkout'

import { shopDeliveryOptionsSelector } from 'src/redux/selectors/shopSelector'
import { ShopDeliveryOptionsModel } from 'src/models/ShopModel/DeliveryOptionsModel'
import { ShopCartModel } from 'src/models/ShopModel/CartModel'
import {
  setBopisTextNotificationAction,
  SetBopisProxyParams,
  setBopisProxyAction,
} from 'src/redux/actions/shop/deliveryAction'
import { refreshCartWithNewPriceAction } from 'src/redux/actions/shop/cartAction'
import { getCartDeliveryOptionsAction } from 'src/redux/actions/shop/deliveryAction'

const Container = styled.View`
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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

const ContinueButton = styled(Button)`
  padding-horizontal: ${({ theme }) => theme.spacing(2)}px;
`

const EditButton = styled.Text`
  color: ${({ theme }) => theme.palette.linkGreen};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.typography.button.small};
`

interface OwnProps {
  step: number
  cart: ShopCartModel
  stepState: CheckoutStepState
  setStepState: (state: CheckoutStepState) => void
}

interface StateProps {
  deliveryOptions: ShopDeliveryOptionsModel
}

const selector = createStructuredSelector<any, StateProps>({
  deliveryOptions: shopDeliveryOptionsSelector,
})

interface DispatchProps {
  getDeliveryOptions: () => void
  setBopisTextNotification: (phoneNumber?: string) => boolean
  setBopisProxy: (params: SetBopisProxyParams) => boolean
  refreshCart: () => void
}

const dispatcher = (dispatch) => ({
  getDeliveryOptions: () => dispatch(getCartDeliveryOptionsAction()),
  setBopisTextNotification: (phoneNumber) =>
    dispatch(setBopisTextNotificationAction(phoneNumber)),
  refreshCart: () => dispatch(refreshCartWithNewPriceAction()),
  setBopisProxy: (params) => dispatch(setBopisProxyAction(params)),
})

type Props = OwnProps & StateProps & DispatchProps

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

const CartDeliveryOptions = ({
  cart,
  deliveryOptions,
  setBopisTextNotification,
  setBopisProxy,
  stepState,
  setStepState,
  refreshCart,
  getDeliveryOptions,
  step,
}: Props) => {
  const [showTextNotification, setShowTextNotification] = useState(false)
  const [showProxyPickup, setShowProxyPickup] = useState(false)

  const [
    textNotificationPhoneNumber,
    setTextNotificationPhoneNumber,
  ] = useState('')
  const [proxyName, setProxyName] = useState('')
  const [proxyEmail, setProxyEmail] = useState('')
  const [proxyPhoneNumber, setProxyPhoneNumber] = useState('')
  const [requestInProgress, setRequestInProgress] = useState(false)

  useEffect(() => {
    if (stepState !== CheckoutStepState.PENDING) {
      getDeliveryOptions()
    }
  }, [stepState])

  useEffect(() => {
    const shippingGroup = cart.shippingGroups?.find(
      (shippingGroup) =>
        shippingGroup.shippingGroupType === 'bopisHardgoodShippingGroup',
    )
    if (shippingGroup && shippingGroup.textNotificationPhoneNumber) {
      setTextNotificationPhoneNumber(
        shippingGroup.textNotificationPhoneNumber || '',
      )
      setShowTextNotification(true)
    }
    if (shippingGroup && shippingGroup.proxyName) {
      setProxyName(shippingGroup.proxyName || '')
      setProxyEmail(shippingGroup.proxyEmail || '')
      setProxyPhoneNumber(shippingGroup.proxyPhoneNumber || '')
      setShowProxyPickup(true)
    }
  }, [cart.shippingGroups])

  const toggleTextNotification = () => {
    setShowTextNotification(!showTextNotification)
  }

  const toggleProxyPickup = () => {
    setShowProxyPickup(!showProxyPickup)
  }

  const continueNextStep = async () => {
    // delivery speed will be set as they are pressed, but bopis is set teogther on continue
    setRequestInProgress(true)
    const [textNotificationResponse, proxyResponse] = await Promise.all([
      setBopisTextNotification(
        showTextNotification ? textNotificationPhoneNumber : undefined,
      ),
      setBopisProxy({
        name: proxyName,
        email: proxyEmail,
        phoneNumber: proxyPhoneNumber,
        proxyPickUp: showProxyPickup,
      }),
    ])
    setRequestInProgress(false)
    if (!textNotificationResponse) {
      return
    }
    if (!proxyResponse) {
      return
    }
    setStepState(CheckoutStepState.COMPLETE)
  }

  if (stepState === CheckoutStepState.PENDING) {
    return (
      <Container>
        <HeaderContainer>
          <StepContainer>
            <StepText>{step}</StepText>
          </StepContainer>
          <TitleText>Delivery Options</TitleText>
          <Flex />
        </HeaderContainer>
      </Container>
    )
  }

  return (
    <Container>
      <HeaderContainer>
        <StepContainer>
          {stepState !== CheckoutStepState.COMPLETE ? (
            <StepText>{step}</StepText>
          ) : (
            <CheckboxCircleIcon source={icons.checkboxCheckedCircle} />
          )}
        </StepContainer>
        <TitleText>Delivery Options</TitleText>
        <Flex />
        {stepState === CheckoutStepState.COMPLETE && (
          <EditButton onPress={() => setStepState(CheckoutStepState.EDIT)}>
            EDIT
          </EditButton>
        )}
      </HeaderContainer>

      {stepState === CheckoutStepState.EDIT ? (
        <ChangeDelieveryOptionList
          cart={cart}
          deliveryOptions={deliveryOptions}
          textNotificationPhoneNumber={textNotificationPhoneNumber}
          proxyName={proxyName}
          proxyEmail={proxyEmail}
          proxyPhoneNumber={proxyPhoneNumber}
          setTextNotificationPhoneNumber={setTextNotificationPhoneNumber}
          setProxyName={setProxyName}
          setProxyEmail={setProxyEmail}
          setProxyPhoneNumber={setProxyPhoneNumber}
          showTextNotification={showTextNotification}
          showProxyPickup={showProxyPickup}
          toggleTextNotification={toggleTextNotification}
          toggleProxyPickup={toggleProxyPickup}
        />
      ) : (
        <DelieveryOptionList cart={cart} deliveryOptions={deliveryOptions} />
      )}

      {(stepState === CheckoutStepState.EDIT && (
        <ContinueButton
          style={{ padding: 14 }}
          onPress={continueNextStep}
          variant="contained"
          maxWidth
          center
          disabled={requestInProgress}
          showSpinner={requestInProgress}
        >
          Continue
        </ContinueButton>
      )) ||
        null}
    </Container>
  )
}

export default connector(CartDeliveryOptions)
