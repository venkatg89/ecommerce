import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {
  withNavigationFocus,
  NavigationFocusInjectedProps,
} from 'react-navigation'
import Geolocation from 'react-native-geolocation-service'
import styled, { ThemeContext } from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Section, { CtaButton } from 'src/controls/layout/Section'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'

import EventList from 'src/components/EventList'

import _StoreDetails from 'src/components/MyBnStore/StoreDetails'
import StoreTooltip from 'src/components/MyBnStore/StoreTooltip'
import { eventsByStoreIdSelector } from 'src/redux/selectors/listings/storeSelector'

import { Params } from 'src/helpers/navigationService'
import { StoreModel, EventModel } from 'src/models/StoreModel'
import { RequestStatus } from 'src/models/ApiStatus'
import {
  getContentContainerStyleWithAnchor,
  useResponsiveDimensions,
} from 'src/constants/layout'
import { fetchStoreDetailsAction } from 'src/redux/actions/store/storeDetails'
import {
  fetchNearestStoreIdAction,
  SearchStoreWithLocationActionParams,
} from 'src/redux/actions/store/search'
import {
  fetchStoreEventsAction,
  fetchMoreStoreEventsAction,
} from 'src/redux/actions/store/events'
import {
  storesSelector,
  favoriteStoreIdSelector,
  storeEventsSelector,
  storeDetailsApiStatusSelector,
} from 'src/redux/selectors/myBn/storeSelector'
import { permissionDeniedAction } from 'src/redux/actions/permissions/request'
import Header from 'src/controls/navigation/Header'
import { ThemeModel } from 'src/models/ThemeModel'

export enum StoreType {
  FAVORITE = 'My B&N',
  DETAILS = '',
  NEARBY = 'Nearby',
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
  getNearestStoreId: (params: SearchStoreWithLocationActionParams) => string
  locationPermissionDenied: () => void
  fetchStoreEvents: (storeId: string) => void
  fetchMoreStoreEvents: (storeId: string) => void
}

const dispatcher = (dispatch) => ({
  fetchStoreDetails: (storeId) => dispatch(fetchStoreDetailsAction(storeId)),
  getNearestStoreId: (params) => dispatch(fetchNearestStoreIdAction(params)),
  locationPermissionDenied: () => dispatch(permissionDeniedAction('location')),
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
  getNearestStoreId,
  locationPermissionDenied,
  isFocused,
  fetchStoreEvents,
  fetchMoreStoreEvents,
  eventsApiStatus,
  allStoreEvents,
  storeDetailsApiStatus,
}: Props) => {
  const stack = navigation.getParam(Params.STACK)

  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()
  const [storeIdState, setStoreIdState] = useState<string | undefined>(
    // @ts-ignore - this is part of the tabnavigator, which is why we use dangerouslyGetParent()
    navigation.getParam(Params.STORE_ID) ||
      navigation.dangerouslyGetParent()?.getParam(Params.STORE_ID) ||
      favoriteStoreId,
  ) // eslint-disable-line
  const [storeTypeState, setStoreTypeState] = useState<StoreType>(
    StoreType.DETAILS,
  )
  const [isListExpanded, setIsListExpanded] = useState<boolean>(false)
  // useEffect hooks are not async safe, use outside
  const setToNearestStoreId = useCallback(async () => {
    Geolocation.getCurrentPosition(
      // eslint-disable-line
      async (position) => {
        const storeId = await getNearestStoreId({
          latitude: position.coords.latitude || 0,
          longitude: position.coords.longitude || 0,
        })
        if (storeId) {
          setStoreIdState(storeId)
          setStoreTypeState(StoreType.NEARBY)
        }
      },
    )
  }, [])

  useEffect(() => {
    const focusListener = navigation.addListener('didFocus', () => {
      if (!storeIdState) {
        setToNearestStoreId()
      }
    })

    return () => {
      focusListener.remove()
    }
  }, [])

  // check for store changes
  useEffect(() => {
    if (!storeIdState) {
      setToNearestStoreId()
    }
  }, [])

  useEffect(() => {
    const storeId = navigation.getParam(Params.STORE_ID)
    if (storeId) {
      setStoreIdState(storeId)
    }
  }, [navigation.getParam(Params.STORE_ID)])

  useEffect(() => {
    // @ts-ignore - this is part of the tabnavigator, which is why we use dangerouslyGetParent()
    const storeId = navigation.dangerouslyGetParent().getParam(Params.STORE_ID)
    if (storeId) {
      setStoreIdState(storeId)
    }
    // @ts-ignore - this is part of the tabnavigator, which is why we use dangerouslyGetParent()
  }, [navigation.dangerouslyGetParent().getParam(Params.STORE_ID)])

  useEffect(() => {
    const storeId = storeIdState
    if (storeId) {
      fetchStoreDetails(storeId)
      stores[storeId] &&
        navigation.setParams({ [Params.STORE_NAME]: stores[storeId].name })
    }
  }, [storeIdState])

  // check for fav store id change
  useEffect(() => {
    if (storeIdState && storeIdState === favoriteStoreId) {
      setStoreTypeState(StoreType.FAVORITE)
    } else {
      setStoreTypeState(StoreType.DETAILS)
    }
  }, [storeIdState, favoriteStoreId])

  // changing favourite store from a different page will update selected store, if removed all favourite stores, set nearest instead
  useEffect(() => {
    if (!isFocused && favoriteStoreId) {
      setStoreIdState(favoriteStoreId)
    } else if (!isFocused) {
      setToNearestStoreId()
    }
  }, [favoriteStoreId])

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
        <StoreTooltip
          storeType={storeTypeState}
          withFavoriteStore={favoriteStoreId ? true : false}
        />
        {store ? (
          <React.Fragment>
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
                  stack={stack}
                />
              )}
            </Section>
          </React.Fragment>
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

export default withNavigationFocus(connector(MyBnStores))
