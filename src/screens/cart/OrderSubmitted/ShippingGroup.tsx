import { icons } from 'assets/images'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import BookImage from 'src/components/BookImage'
import styled from 'styled-components/native'
import { ItemGroup } from '../OrderSubmitted'

const Container = styled.View`
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

const ShippingSummaryText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey2};
  line-height: 16;
  letter-spacing: 0.4;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const EstimatedTime = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  line-height: 18;
  letter-spacing: 0.4;
`

const PreOrderText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  line-height: 18;
  letter-spacing: 0.4;
  margin-top: ${({ theme }) => theme.spacing(2.5)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`
const PreOrderIcon = styled.Image`
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(1)};
`
const PreOrderContainer = styled.View`
  flex-direction: row;
`

const CheckboxCircleIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const PickUpDescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  line-height: 16;
  letter-spacing: 0.4;
`
const PickUpLocationContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const StoreContainer = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(1)};
`

const PickUpNotification = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  line-height: 18;
  letter-spacing: 0.4;
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-right: ${({ theme }) => theme.spacing(4)};
`

const ArrivalDateContainer = styled.View``

const BookContainer = styled.View`
  margin-right: ${({ theme }) => theme.spacing(2)};
`

interface Props {
  group: ItemGroup
}

const ShippingGroup = ({ group }: Props) => {
  const renderEstimatedTime = () => {
    return (
      group.shipping &&
      group.items.length > 0 && (
        <ArrivalDateContainer>
          {group.items[0].preordered && (
            <PreOrderContainer>
              <PreOrderIcon source={icons.preOrder} />
              <PreOrderText>Pre-Order</PreOrderText>
            </PreOrderContainer>
          )}
          <EstimatedTime>
            {group.items[0].preordered
              ? 'Expected to ship '
              : 'Expected arrival is '}
            {group.items[0].deliveryDate}
          </EstimatedTime>
        </ArrivalDateContainer>
      )
    )
  }

  return (
    <Container>
      <ShippingSummaryText>{group.heading}</ShippingSummaryText>
      <FlatList
        horizontal
        data={group.items}
        renderItem={({ item }) => {
          return (
            <BookContainer>
              <BookImage size="medium" bookOrEan={item.ean} />
            </BookContainer>
          )
        }}
      />
      {renderEstimatedTime()}
      {group.bopis && (
        <>
          <PickUpLocationContainer>
            <CheckboxCircleIcon source={icons.store} />
            <StoreContainer>
              <PickUpDescriptionText>
                {group.address.address1}
              </PickUpDescriptionText>
              <PickUpDescriptionText>
                {group.address.city}, {group.address.state}
              </PickUpDescriptionText>
              <PickUpDescriptionText>
                {group.address.postalCode}
              </PickUpDescriptionText>
              {group.address.phoneNumber && (
                <PickUpDescriptionText>
                  {group.address.phoneNumber}
                </PickUpDescriptionText>
              )}
              {group.proxyPickupName && (
                <>
                  <PickUpDescriptionText
                    style={{
                      marginTop: 16,
                      fontWeight: 'bold',
                    }}
                  >
                    To be picked up by
                  </PickUpDescriptionText>
                  <PickUpDescriptionText>
                    {group.proxyPickupName}
                  </PickUpDescriptionText>
                </>
              )}
            </StoreContainer>
          </PickUpLocationContainer>
          <PickUpNotification>
            No need to rush to the store yet, we’ll send you a text when it’s
            ready for pickup.
          </PickUpNotification>
        </>
      )}
      {group.electronic && (
        <PickUpNotification>Available immediately.</PickUpNotification>
      )}
    </Container>
  )
}

export default ShippingGroup
