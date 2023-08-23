import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import { icons } from 'assets/images'
import RadioButton from 'src/controls/Button/RadioButton'
import _TextField from 'src/controls/form/TextField'
import _LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import BookCarouselHorizontalRow from 'src/components/BookCarousel/HorizontalRow'

import countLabelText from 'src/helpers/countLabelText'
import { ShopDeliveryOptionsModel } from 'src/models/ShopModel/DeliveryOptionsModel'
import { ShopCartModel } from 'src/models/ShopModel/CartModel'
import {
  setCartItemShippingMethodAction,
  SetCartItemShippingMethodParams,
} from 'src/redux/actions/shop/deliveryAction'

const Container = styled.View`
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(4)};
`

const Divider = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.grey5};
`

const Header = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const Spacer = styled.View`
  width: ${({ theme }) => theme.spacing(2)};
`

const StoreDetailsContainer = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const FindStoreIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const ShippingSpeedOptionContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const StoreDetailsTextContainer = styled.View``

const StoreDetailsText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const ShippingDescription = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(4)};
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const ShippingMethodOptionTitle = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
`

const ShippingMethodOptionDescription = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey3};
`

const BopisHeaderText = styled.Text`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey2};
`

const RadioButtonText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const TextField = styled(_TextField)`
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const ShippingDescriptionContainer = styled.View`
  position: relative;
`

const LoadingIndicator = styled(_LoadingIndicator)`
  position: absolute;
  align-self: center;
`

interface OwnProps {
  cart: ShopCartModel
  deliveryOptions: ShopDeliveryOptionsModel
  textNotificationPhoneNumber: string
  proxyName: string
  proxyEmail: string
  proxyPhoneNumber: string
  setTextNotificationPhoneNumber: (value: string) => void
  setProxyName: (value: string) => void
  setProxyEmail: (value: string) => void
  setProxyPhoneNumber: (value: string) => void
  showTextNotification: boolean
  showProxyPickup: boolean
  toggleTextNotification: () => void
  toggleProxyPickup: () => void
}

interface DispatchProps {
  setCartItemShippingMethod: (
    params: SetCartItemShippingMethodParams,
  ) => boolean
}

const dispatcher = (dispatch) => ({
  setCartItemShippingMethod: (params) =>
    dispatch(setCartItemShippingMethodAction(params)),
})

const connector = connect<{}, DispatchProps, OwnProps>(null, dispatcher)

type Props = OwnProps & DispatchProps

const ChangeDeliveryOptionList = ({
  cart,
  deliveryOptions,
  setCartItemShippingMethod,
  textNotificationPhoneNumber,
  proxyName,
  proxyEmail,
  proxyPhoneNumber,
  setTextNotificationPhoneNumber,
  setProxyName,
  setProxyEmail,
  setProxyPhoneNumber,
  showTextNotification,
  showProxyPickup,
  toggleTextNotification,
  toggleProxyPickup,
}: Props) => {
  const shippingRelationship = cart.shippingRelationship
  const shippingGroups = cart.shippingGroups
  const items = cart.items

  const [deliveryOptionIsLoading, setDeliveryOptionIsLoading] = useState<
    string[]
  >([])

  const toggleDeliveryOptionIsLoading = (id, remove) => {
    if (remove) {
      setDeliveryOptionIsLoading((prevState) =>
        prevState.filter((_id) => _id !== id),
      )
    } else {
      setDeliveryOptionIsLoading((prevState) => [...prevState, id])
    }
  }

  const renderTitle = useCallback((shippingGroup) => {
    const shippingGroupId = shippingGroup.id
    const quantity = shippingRelationship
      .filter(
        (relationship) => relationship.shippingGroupId === shippingGroupId,
      )
      .reduce((count, relationship) => relationship.quantity + count, 0)

    switch (
      shippingGroup.shippingGroupType // TODO: move into enum
    ) {
      case 'electronicShippingGroup': {
        // TODO: guard need to remove this
        return (
          quantity > 0 ? <Header>{`${countLabelText(
            quantity,
            'item',
            'items',
          )} Shipped from digitally`}</Header> : null
        )
      }
      case 'bopisHardgoodShippingGroup': {
        return (
          quantity > 0 ? <Header>{`${countLabelText(
            quantity,
            'item',
            'items',
          )} for Pick Up in store`}</Header> : null
        )
      }
      default: {
        return (
          quantity > 0 ? <Header>{`${countLabelText(
            quantity,
            'item',
            'items',
          )} Shipped from `}</Header> : null
        )
      }
    }
  }, [])

  const renderItemCarousel = useCallback((shippingGroupId) => {
    const commerceItemIds = shippingRelationship
      .filter(
        (relationship) => relationship.shippingGroupId === shippingGroupId,
      )
      .map((relationship) => relationship.commerceItemId)
    const eans = items
      .filter((item) => commerceItemIds.includes(item.id))
      .map((item) => item.ean)

    return <BookCarouselHorizontalRow disableNavigation eans={eans} />
  }, [])

  const renderShippingOptions = (shippingGroup) => {
    const shippingGroupId = shippingGroup.id
    switch (
      shippingGroup.shippingGroupType // TODO: move into enum
    ) {
      case 'electronicShippingGroup': {
        // TODO: guard need to remove this
        return (
          <ShippingDescription>Will be sent electronically</ShippingDescription>
        )
      }
      case 'bopisHardgoodShippingGroup': {
        const shippingAddress = shippingGroup.shippingAddress
        if (!shippingAddress) {
          return null
        }
        return (
          <>
            <StoreDetailsContainer>
              <FindStoreIcon source={icons.findStore} />
              <StoreDetailsTextContainer>
                <StoreDetailsText>{shippingAddress.address1}</StoreDetailsText>
                <StoreDetailsText>{shippingAddress.address2}</StoreDetailsText>
                <StoreDetailsText>{`${shippingAddress.city}, ${shippingAddress.country}`}</StoreDetailsText>
                <StoreDetailsText>
                  {shippingAddress.postalCode}
                </StoreDetailsText>
                <StoreDetailsText>
                  {shippingAddress.phoneNumber}
                </StoreDetailsText>
              </StoreDetailsTextContainer>
            </StoreDetailsContainer>
            <BopisHeaderText>Text Notification</BopisHeaderText>
            <RadioButton
              selected={showTextNotification}
              onPress={toggleTextNotification}
              checkboxStyle
            >
              <RadioButtonText>
                Receive a text when your order is ready for pick up. Normal text
                message rates apply.
              </RadioButtonText>
            </RadioButton>
            {showTextNotification && (
              <TextField
                label="Mobile Phone Number"
                onChange={setTextNotificationPhoneNumber}
                value={textNotificationPhoneNumber}
                formId="CartCheckout-BOPIS-TextNotification"
                formFieldId="phoneNumber"
              />
            )}

            <Spacer />
            <BopisHeaderText>Proxy Pickup</BopisHeaderText>
            <RadioButton
              selected={showProxyPickup}
              onPress={toggleProxyPickup}
              checkboxStyle
            >
              <RadioButtonText>
                Will someone else pick up your order?
              </RadioButtonText>
            </RadioButton>
            {showProxyPickup && (
              <>
                <TextField
                  label="Name"
                  onChange={setProxyName}
                  value={proxyName}
                  formId="CartCheckout-BOPIS-ProxyDetails"
                  formFieldId="proxyName"
                />
                <TextField
                  label="Email"
                  onChange={setProxyEmail}
                  value={proxyEmail}
                  formId="CartCheckout-BOPIS-ProxyDetails"
                  formFieldId="proxyEmail"
                />
                <TextField
                  label="Phone Number (Optional)"
                  onChange={setProxyPhoneNumber}
                  value={proxyPhoneNumber}
                  formId="CartCheckout-BOPIS-ProxyDetails"
                  formFieldId="proxyPhoneNumber"
                />
              </>
            )}
          </>
        )
      }
      default: {
        const options = deliveryOptions[shippingGroupId] || []
        if (options && options.length > 0) {
          return (
            <ShippingDescriptionContainer>
              <ShippingDescription>Choose Shipping Speed</ShippingDescription>
              {options.map((option) => (
                <ShippingSpeedOptionContainer>
                  <RadioButton
                    selected={
                      option.shippingMethodId ===
                      shippingGroup.selectedShippingMethod
                    }
                    disabled={deliveryOptionIsLoading.includes(shippingGroupId)}
                    onPress={async () => {
                      toggleDeliveryOptionIsLoading(shippingGroupId, false)
                      await setCartItemShippingMethod({
                        shippingMethodId: option.shippingMethodId,
                        shippingGroupId,
                      })
                      toggleDeliveryOptionIsLoading(shippingGroupId, true)
                    }}
                  >
                    <ShippingMethodOptionTitle>{`${option.displayName} - ${
                      option.shippingPrice ? `$${option.shippingPrice}` : 'FREE'
                    }`}</ShippingMethodOptionTitle>
                    <ShippingMethodOptionDescription>
                      {option.deliveryPromise}
                    </ShippingMethodOptionDescription>
                  </RadioButton>
                </ShippingSpeedOptionContainer>
              ))}
              <LoadingIndicator
                isLoading={deliveryOptionIsLoading.includes(shippingGroupId)}
              />
            </ShippingDescriptionContainer>
          )
        } else {
          return null
        }
      }
    }
  }

  return (
    <Container>
      {shippingGroups.map((shippingGroup, index) => {
        return (
          <>
            {!!index && <Divider />}
              {renderTitle(shippingGroup)}
              {renderItemCarousel(shippingGroup.id)}
              {renderShippingOptions(shippingGroup)}
          </>
        )
      })}
    </Container>
  )
}

export default connector(ChangeDeliveryOptionList)
