import React, { useCallback, useEffect } from 'react'
import { Platform, Linking } from 'react-native'
import { connect } from 'react-redux'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Container from 'src/controls/layout/ScreenContainer'
import { NavigationInjectedProps } from 'react-navigation'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import Button from 'src/controls/Button'
import _LocationDetails from 'src/components/Cafe/LocationDetails'

import {
  CafeCurrentOrder,
  CafeOrderStatus,
} from 'src/models/CafeModel/OrderModel'
import { CafeVenue } from 'src/models/CafeModel/VenueModel'
import { monthDayYearAtTime } from 'src/helpers/dateFormatters'

import { fetchCurrentOrdersAction } from 'src/redux/actions/cafe/orderAction'
import {
  currentOrdersSelector,
  venuesSelector,
  checkedInVenueSelector,
} from 'src/redux/selectors/cafeSelector'
import { favoriteStoreIdSelector } from 'src/redux/selectors/myBn/storeSelector'

import { push, Routes, Params } from 'src/helpers/navigationService'
import {
  addEventAction,
  LL_CAFE_ORDER_STARTED,
} from 'src/redux/actions/localytics'

const LocationDetails = styled(_LocationDetails)`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const StartYourOrderButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const OrderStatusContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const OrderStatusText = styled.Text`
  ${({ theme }) => theme.typography.title}
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing(5)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  font-family: PoynterOSDisp-Semibold;
`

const OrderStatusBodyText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: #4d5961;
  text-align: center;
`

const OrderNumber = styled.View`
  ${({ theme }) => theme.boxShadow.container};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  padding-vertical: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme }) => theme.spacing(3)};
  background-color: ${({ theme }) => theme.palette.white};
  align-items: center;
`

const PickupCodeText = styled.Text`
  ${({ theme }) => theme.typography.heading1}
  color: ${({ theme }) => theme.palette.grey1};
  font-size: 48;
  letter-spacing: 1.2;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const OrderNumberText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey3};
`

interface ButtonWrapperProps {
  direction?: boolean
}

const ButtonWrapper = styled.View<ButtonWrapperProps>`
  margin: ${({ theme }) => theme.spacing(2)}px;
  ${({ direction, theme }) => (direction ? 'width: 60%;' : '')}
`

const DirectionButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(1.5)}px;
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const OrderDetailsTitleText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(1)};
  align-self: flex-start;
`
const OrderDetailsText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-left: ${({ theme }) => theme.spacing(0)};
  align-self: flex-start;
`

export const parseOrderStatus = (orderStatus: string) => {
  switch (orderStatus) {
    case CafeOrderStatus.PREPARATION:
      return 'Preparing your Cafe order'
    case CafeOrderStatus.DELIVERY:
      return 'Your order is ready for pickup'
    case CafeOrderStatus.APPROVAL:
      return 'Pending for approval'
    default:
      return 'We received your order'
  }
}

const parseOrderStatusBody = (orderStatus: string) => {
  switch (orderStatus) {
    case CafeOrderStatus.PREPARATION:
      return 'You can pick it up in 5–7 minutes.'
    default:
      return undefined
  }
}

interface OwnProps {
  isOpen: boolean
  onDismiss: () => void
}

interface StateProps {
  currentOrders: CafeCurrentOrder[]
  venues: Record<string, CafeVenue>
  venue?: CafeVenue
  favoriteStoreId?: string
}

const selector = createStructuredSelector({
  currentOrders: currentOrdersSelector,
  venues: venuesSelector,
  venue: checkedInVenueSelector,
  favoriteStoreId: favoriteStoreIdSelector,
})

interface DispatchProps {
  fetchCurrentOrders: () => boolean
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  fetchCurrentOrders: () => dispatch(fetchCurrentOrdersAction()),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps & NavigationInjectedProps

const CafeOrderReceivedScreen = ({
  navigation,
  isOpen,
  onDismiss,
  venues,
  currentOrders,
  fetchCurrentOrders: _fetchCurrentOrders,
  venue,
  favoriteStoreId,
  addEvent,
}: Props) => {
  const orderId = navigation.getParam(Params.CAFE_CURRENT_ORDER_ID, '')
  const currentOrder = currentOrders.find((order) => order.id === orderId)

  const fetchCurrentOrders = useCallback(async () => {
    const hasOrders = await _fetchCurrentOrders()
    if (!hasOrders) {
      onDismiss()
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchCurrentOrders()
    }
  }, [isOpen])

  const navigateToDirection = useCallback(
    (venueId: string) => () => {
      const venue = venues[venueId]
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      })
      const latLng = `${venue.latitude},${venue.longitude}`
      const label = encodeURIComponent(venue.name)
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      })
      Linking.openURL(url!)
    },
    [venues],
  )

  return (
    <Container>
      <ScrollContainer withAnchor>
        {currentOrder && (
          <React.Fragment key={currentOrder.id}>
            <>
              <OrderStatusContainer>
                <OrderStatusText>
                  {parseOrderStatus(currentOrder.orderStatus)}
                </OrderStatusText>
                {parseOrderStatusBody(currentOrder.orderStatus) && (
                  <OrderStatusBodyText>
                    {parseOrderStatusBody(currentOrder.orderStatus)}
                  </OrderStatusBodyText>
                )}
              </OrderStatusContainer>
              {currentOrder.pickupCode && (
                <OrderNumber>
                  <PickupCodeText>{currentOrder.pickupCode}</PickupCodeText>
                  <OrderNumberText>Order Number</OrderNumberText>
                </OrderNumber>
              )}
              <LocationDetails venueId={currentOrder.venueId} withName />
              <ButtonWrapper>
                <DirectionButton
                  variant="outlined"
                  onPress={navigateToDirection(currentOrder.venueId)}
                  linkGreen
                  center
                  style={{ width: '70%' }}
                >
                  GET DIRECTIONS
                </DirectionButton>
              </ButtonWrapper>
              <OrderDetailsTitleText>Order Details</OrderDetailsTitleText>
              <OrderDetailsText>{`Order #: ${currentOrder.id}`}</OrderDetailsText>
              <OrderDetailsText>{`Order total: $${
                currentOrder.totalAmount / 100.0
              }`}</OrderDetailsText>
              <OrderDetailsText>{`Placed on: ${monthDayYearAtTime(
                currentOrder.date,
              )}`}</OrderDetailsText>
            </>
          </React.Fragment>
        )}
      </ScrollContainer>
      <StartYourOrderButton
        variant="contained"
        onPress={() => {
          push(Routes.CAFE__CATEGORIES)
          if (venue) {
            const cafeOrderStarted = {
              storeName: venue.name,
              city: venue.city,
              state: venue.state,
              favorite: venue.storeId === favoriteStoreId ? 'yes' : 'no',
            }
            addEvent(LL_CAFE_ORDER_STARTED, cafeOrderStarted)
          }
        }}
        disabled={false}
        maxWidth
        center
        isAnchor
      >
        START A NEW ORDER
      </StartYourOrderButton>
    </Container>
  )
}

export default connector(CafeOrderReceivedScreen)
