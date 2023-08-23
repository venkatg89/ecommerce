import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationFocusInjectedProps } from 'react-navigation'
import styled, { ThemeContext } from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Section, { CtaButton } from 'src/controls/layout/Section'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'

import EventList from 'src/components/EventList'
import _StoreDetails from 'src/components/MyBnStore/StoreDetails'

import { eventsByStoreIdSelector } from 'src/redux/selectors/listings/storeSelector'

import { Params, Routes } from 'src/helpers/navigationService'
import { StoreModel, EventModel } from 'src/models/StoreModel'
import { RequestStatus } from 'src/models/ApiStatus'

import {
  getContentContainerStyleWithAnchor,
  useResponsiveDimensions,
} from 'src/constants/layout'
import { fetchStoreDetailsAction } from 'src/redux/actions/store/storeDetails'
import {
  fetchStoreEventsAction,
  fetchMoreStoreEventsAction,
} from 'src/redux/actions/store/events'

import {
  storesSelector,
  storeEventsSelector,
  storeDetailsApiStatusSelector,
} from 'src/redux/selectors/myBn/storeSelector'
import { ThemeModel } from 'src/models/ThemeModel'
import Header from 'src/controls/navigation/Header'
import { favoriteStoreIdSelector } from 'src/redux/selectors/myBn/storeSelector'

export enum StoreType {
  FAVORITE = 'My B&N',
  DETAILS = '',
}

const ErrorMessage = styled.Text`
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey2};
  text-align: center;
`

const StoreDetails = styled(_StoreDetails)`
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`
interface StateProps {
  stores: Record<string, StoreModel>
  favoriteStoreId: string
  events: Record<string, EventModel>
  allStoreEvents: EventModel[]
  eventsApiStatus?: RequestStatus
  storeDetailsApiStatus: Nullable<RequestStatus>
}
const selector = createStructuredSelector({
  stores: storesSelector,
  favoriteStoreId: favoriteStoreIdSelector,
  events: storeEventsSelector,
  allStoreEvents: (state, ownProps) => {
    const storeId = ownProps.navigation.getParam(Params.STORE_ID)
    return eventsByStoreIdSelector(state, { storeId })
  },
  storeDetailsApiStatus: (state, ownProps) => {
    const storeId = ownProps.navigation.getParam(Params.STORE_ID)
    return storeDetailsApiStatusSelector(state, { storeId })
  },
})
interface DispatchProps {
  fetchStoreDetails: (storeId: string) => void
  fetchStoreEvents: (storeId: string) => void
  fetchMoreStoreEvents: (storeId: string) => void
}
const dispatcher = (dispatch) => ({
  fetchStoreDetails: (storeId) => dispatch(fetchStoreDetailsAction(storeId)),
  fetchStoreEvents: (storeId) => dispatch(fetchStoreEventsAction(storeId)),
  fetchMoreStoreEvents: (storeId) =>
    dispatch(fetchMoreStoreEventsAction(storeId)),
})
const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)
type Props = StateProps & DispatchProps & NavigationFocusInjectedProps
const MyBnStores = ({
  navigation,
  stores,
  events,
  favoriteStoreId,
  fetchStoreDetails,
  fetchStoreEvents,
  fetchMoreStoreEvents,
  eventsApiStatus,
  allStoreEvents,
  storeDetailsApiStatus,
}: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()
  const [storeIdState, setStoreIdState] = useState<string | undefined>(
    navigation.getParam(Params.STORE_ID) || favoriteStoreId,
  )

  const [isListExpanded, setIsListExpanded] = useState<boolean>(false)

  useEffect(() => {
    const storeId = navigation.getParam(Params.STORE_ID)
    if (storeId) {
      setStoreIdState(storeId)
    }
  }, [navigation.getParam(Params.STORE_ID)])

  useEffect(() => {
    const storeId = storeIdState
    if (storeId) {
      fetchStoreDetails(storeId)
      stores[storeId] &&
        navigation.setParams({ [Params.STORE_NAME]: stores[storeId].name })
    }
  }, [storeIdState])

  const fetchEvents = useCallback(() => {
    fetchStoreEvents(storeIdState || '')
  }, [])

  const fetchMoreEvents = useCallback(() => {
    fetchMoreStoreEvents(storeIdState || '')
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [])

  const store = (storeIdState && stores[storeIdState]) || undefined
  const upcomingEvent =
    store && store.upcomingStoreEventId && events[store.upcomingStoreEventId]
  const contentContainerStyle = useMemo(
    () => getContentContainerStyleWithAnchor(theme, width),
    [theme, width],
  )

  return (
    <Container>
      <LoadingIndicator
        isLoading={storeDetailsApiStatus === RequestStatus.FETCHING}
      />
      <ScrollContainer contentContainerStyle={contentContainerStyle}>
        {store ? (
          <>
            <StoreDetails storeDetails={store} />
            <Section
              title="Upcoming Events"
              ctaButton={
                <CtaButton
                  title={isListExpanded ? 'See Less' : 'See More'}
                  onPress={() => {
                    setIsListExpanded(!isListExpanded)
                  }}
                />
              }
            >
              {upcomingEvent && allStoreEvents && (
                <EventList
                  eventList={isListExpanded ? allStoreEvents : [upcomingEvent]}
                  onRefresh={fetchEvents}
                  onEndReached={fetchMoreEvents}
                  fetching={eventsApiStatus === RequestStatus.FETCHING}
                  stack={Routes.CAFE_TAB}
                />
              )}
            </Section>
          </>
        ) : (
          storeDetailsApiStatus === RequestStatus.FAILED && (
            <ErrorMessage>
              Store failed to load. Please try again later.
            </ErrorMessage>
          )
        )}
      </ScrollContainer>
    </Container>
  )
}

MyBnStores.navigationOptions = () => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})
export default connector(MyBnStores)
