import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { icons } from 'assets/images'

import countLabelText from 'src/helpers/countLabelText'
import { ShopDeliveryOptionsModel } from 'src/models/ShopModel/DeliveryOptionsModel'
import { ShopCartModel } from 'src/models/ShopModel/CartModel'

const Container = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  margin-left: ${({ theme }) => theme.spacing(4)};
`

const Header = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const ShippingDescription = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`

const ShippingMethodOption = styled.View`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`

const ShippingMethodOptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const StoreDetailsContainer = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`

const FindStoreIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const StoreDetailsTextContainer = styled.View``

const StoreDetailsText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const ToBePickedUpByText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey2};
`

interface OwnProps {
  cart: ShopCartModel
  deliveryOptions: ShopDeliveryOptionsModel
}

type Props = OwnProps

const DeliveryOptionList = ({ cart, deliveryOptions }: Props) => {
  const shippingRelationship = cart.shippingRelationship
  const shippingGroups = cart.shippingGroups

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
          )} shipped digitally`}</Header> : null
        )
      }
      case 'bopisHardgoodShippingGroup': {
        return (
          quantity > 0 ? <Header>{`${countLabelText(
            quantity,
            'item',
            'items',
          )} for Pick Up in Store`}</Header> : null
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

  const renderShippingOptions = useCallback(
    (shippingGroup) => {
      const shippingGroupId = shippingGroup.id
      switch (shippingGroup.shippingGroupType) {
        case 'electronicShippingGroup': {
          // ebooks
          return (
            <ShippingDescription>
              Will be sent electronically
            </ShippingDescription>
          )
        }
        case 'bopisHardgoodShippingGroup': {
          const shippingAddress = shippingGroup.shippingAddress
          if (!shippingAddress) {
            return null
          }
          return (
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
                {!!shippingGroup.proxyName && (
                  <>
                    <ToBePickedUpByText>To be picked up by</ToBePickedUpByText>
                    <StoreDetailsText>
                      {shippingGroup.proxyName}
                    </StoreDetailsText>
                  </>
                )}
              </StoreDetailsTextContainer>
            </StoreDetailsContainer>
          )
        }
        default: {
          const options = deliveryOptions[shippingGroupId]
          if (!options) {
            return null
          }
          const selectedDeliveryOption = options.find(
            (option) =>
              option.shippingMethodId === shippingGroup.selectedShippingMethod,
          )

          return (
            selectedDeliveryOption && (
              <ShippingMethodOption>
                <ShippingMethodOptionText>
                  {`${selectedDeliveryOption.displayName} - ${
                    selectedDeliveryOption.shippingPrice
                      ? `$${selectedDeliveryOption.shippingPrice}`
                      : 'FREE'
                  }`}
                </ShippingMethodOptionText>
                <ShippingMethodOptionText>
                  {selectedDeliveryOption.deliveryPromise}
                </ShippingMethodOptionText>
              </ShippingMethodOption>
            )
          )
        }
      }
    },
    [deliveryOptions],
  )

  return (
    <Container>
      {shippingGroups?.map((shippingGroup, index) => {
        return (
          <>
              {renderTitle(shippingGroup)}
              {renderShippingOptions(shippingGroup)}
          </>
        )
      })}
    </Container>
  )
}

export default DeliveryOptionList
