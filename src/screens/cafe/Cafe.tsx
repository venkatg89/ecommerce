import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import { NavigationStackProp } from 'react-navigation-stack'

import Container from 'src/controls/layout/ScreenContainer'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Button from 'src/controls/Button'
import PaymentCardsButton from 'src/controls/cafe/PaymentCardsButton'

import Promotion from 'src/components/Cafe/Promotion'
import RecentOrderCarousel from 'src/components/Cafe/RecentOrderCarousel'
import _SelectedVenueHeader from 'src/components/Cafe/SelectedVenueHeader'
import { fetchCurrentOrdersAction } from 'src/redux/actions/cafe/orderAction'
import { getCafePromotionsData } from 'src/data/cafe/promotions'
import { CafePromotion } from 'src/models/CafeModel/Promotion'

import { push, Routes, Params } from 'src/helpers/navigationService'

import {
  checkInUserStoreAction,
  CheckInUserStoreActionParams,
} from 'src/redux/actions/cafe/checkInAction'
import { openCafeOrderProgressModalAction } from 'src/redux/actions/modals/cafeOrderProgress'
import {
  checkedInVenueIdSelector,
  currentOrdersSelector,
  checkedInVenueSelector,
} from 'src/redux/selectors/cafeSelector'
import { favoriteStoreIdSelector } from 'src/redux/selectors/myBn/storeSelector'
import ProgressBar from 'src/controls/ProgressBar'
import { CafeOrderStatus } from 'src/models/CafeModel/OrderModel'
import { parseOrderStatus } from './OrderReceived'
import { CafeVenue } from 'src/models/CafeModel/VenueModel'
import {
  addEventAction,
  LL_CAFE_ORDER_STARTED,
} from 'src/redux/actions/localytics'

const FlexRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 4;
  margin-bottom: 20;
`
const Wrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`

const PlaceHolder = styled.View`
  width: ${({ theme, large }) => theme.spacing(large ? 4 : 3)};
`

const SelectedVenueHeader = styled(_SelectedVenueHeader)`
  padding-horizontal: ${({ theme }) => theme.spacing(1)};
  flex: 1;
`

const FlexContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const StartYourOrderButton = styled(Button)``

const OrderStatusCard = styled.TouchableOpacity`
  padding: 16px;
  background-color: #454f56;
  margin-bottom: 16px;
  border-radius: 4px;
`
const OrderStatusCardText = styled.Text`
  font-family: PoynterOSDisp-Semibold;
  color: #ffffff;
  font-size: 20px;
  margin-bottom: 8px;
`
const OrderIdText = styled.Text`
  font-family: Lato-Regular;
  color: #cccccc;
  font-size: 14px;
  margin-top: 8px;
`

interface StateProps {
  checkedInVenue?: string
  currentOrders?: any
  venue?: CafeVenue
  favoriteStoreId?: string
}

const selector = createStructuredSelector({
  checkedInVenue: checkedInVenueIdSelector,
  currentOrders: currentOrdersSelector,
  venue: checkedInVenueSelector,
  favoriteStoreId: favoriteStoreIdSelector,
})

interface DispatchProps {
  openCafeOrderProgressModal: () => void
  checkInStore: (params?: CheckInUserStoreActionParams) => void
  fetchCurrentOrders: () => boolean
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  openCafeOrderProgressModal: () =>
    dispatch(openCafeOrderProgressModalAction()),
  checkInStore: (params) => dispatch(checkInUserStoreAction(params)),
  fetchCurrentOrders: () => dispatch(fetchCurrentOrdersAction()),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & { navigation: NavigationStackProp }

const getOrderProgress = (orderStatus: string) => {
  switch (orderStatus) {
    case CafeOrderStatus.PREPARATION:
      return 0.66
    case CafeOrderStatus.APPROVAL:
      return 0.05
    case CafeOrderStatus.DELIVERY:
      return 1
    default:
      return 0.33
  }
}

const CafeScreen = ({
  navigation,
  checkInStore,
  checkedInVenue,
  openCafeOrderProgressModal,
  currentOrders,
  fetchCurrentOrders,
  venue,
  favoriteStoreId,
  addEvent,
}: Props) => {
  const [promotions, setPromotions] = useState<CafePromotion[]>([])

  useEffect(() => {
    if (navigation.getParam('openCurrentOrders')) {
      openCafeOrderProgressModal()
      navigation.setParams({ openCurrentOrders: null })
    }
  }, [navigation.getParam('openCurrentOrders')])

  useEffect(() => {
    const storeId = navigation.getParam(Params.STORE_ID, undefined)
    const venueId = navigation.getParam(Params.CAFE_VENUE_ID, undefined)
    checkInStore({ storeId, venueId })
  }, [
    navigation.getParam(Params.STORE_ID),
    navigation.getParam(Params.CAFE_VENUE_ID),
  ])

  useEffect(() => {
    fetchCurrentOrders()
  }, [])

  useEffect(() => {
    const callback = async () => {
      const promotions = await getCafePromotionsData()
      setPromotions(promotions)
    }
    callback()
  }, [])

  return (
    <Container>
      <ScrollContainer withAnchor>
        <FlexRow>
          <Wrapper>
            <PaymentCardsButton />
            <SelectedVenueHeader />
          </Wrapper>
          <PlaceHolder />
        </FlexRow>
        {!!promotions.length &&
          promotions.map((promotion) => (
            <Promotion key={promotion.id} promotion={promotion} />
          ))}
        <FlexContainer />
        {!!currentOrders.length &&
          currentOrders.map((currentOrder) => (
            <OrderStatusCard
              key={currentOrder.id}
              onPress={() => {
                push(Routes.CAFE__ORDERS, {
                  [Params.CAFE_CURRENT_ORDER_ID]: currentOrder.id,
                })
              }}
            >
              <OrderStatusCardText>
                {parseOrderStatus(currentOrder.orderStatus)}
              </OrderStatusCardText>
              <ProgressBar
                progress={getOrderProgress(currentOrder.orderStatus)}
                color={'#549c6e'}
              />
              <OrderIdText>Order #: {currentOrder.id}</OrderIdText>
            </OrderStatusCard>
          ))}
        <RecentOrderCarousel disable={!checkedInVenue} />
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
        disabled={!checkedInVenue}
        isAnchor
      >
        Start A New Order
      </StartYourOrderButton>
    </Container>
  )
}

export default connector(CafeScreen)
