import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import styled from 'styled-components/native'

import _Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'

import EventList from 'src/components/EventList'
import _ScreenHeader from 'src/components/ScreenHeader'

import {
  CONTENT_HORIZONTAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'
import { Params } from 'src/helpers/navigationService'
import { StoreModel, EventModel } from 'src/models/StoreModel'
import { RequestStatus } from 'src/models/ApiStatus'

import {
  fetchStoreEventsAction,
  fetchMoreStoreEventsAction,
} from 'src/redux/actions/store/events'
import { eventsByStoreIdSelector } from 'src/redux/selectors/listings/storeSelector'
import { storeSelector } from 'src/redux/selectors/myBn/storeSelector'
import { storeEventsApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/store'

interface HeaderContainer {
  currentWidth: number
}

const ScreenHeader = styled(_ScreenHeader)<HeaderContainer>`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  padding-horizontal: ${({ currentWidth }) =>
    CONTENT_HORIZONTAL_PADDING(currentWidth)};
`

const Container = styled(_Container)`
  padding-top: ${({ theme }) => theme.spacing(3)};
`

interface StateProps {
  store: StoreModel
  events: EventModel[]
  eventsApiStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  store: (state, ownProps) => {
    const storeId = ownProps.navigation.getParam(Params.STORE_ID)
    return storeSelector(state, { storeId })
  },
  events: (state, ownProps) => {
    const storeId = ownProps.navigation.getParam(Params.STORE_ID)
    return eventsByStoreIdSelector(state, { storeId })
  },
  eventsApiStatus: (state, ownProps) => {
    const storeId = ownProps.navigation.getParam(Params.STORE_ID)
    return storeEventsApiRequestStatusSelector(state, { storeId })
  },
})

interface DispatchProps {
  fetchStoreEvents: (storeId: string) => void
  fetchMoreStoreEvents: (storeId: string) => void
}

const dispatcher = (dispatch) => ({
  fetchStoreEvents: (storeId) => dispatch(fetchStoreEventsAction(storeId)),
  fetchMoreStoreEvents: (storeId) =>
    dispatch(fetchMoreStoreEventsAction(storeId)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const StoreEvents = ({
  navigation,
  store,
  events,
  fetchStoreEvents,
  fetchMoreStoreEvents,
  eventsApiStatus,
}: Props) => {
  const { width } = useResponsiveDimensions()
  const fetchEvents = useCallback(() => {
    const storeId = navigation.getParam(Params.STORE_ID)
    fetchStoreEvents(storeId)
  }, [])
  const fetchMoreEvents = useCallback(() => {
    const storeId = navigation.getParam(Params.STORE_ID)
    fetchMoreStoreEvents(storeId)
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <Container>
      <ScreenHeader
        currentWidth={width}
        header="Upcoming Events"
        body={store.name}
      />
      <EventList
        eventList={events}
        onRefresh={fetchEvents}
        onEndReached={fetchMoreEvents}
        fetching={eventsApiStatus === RequestStatus.FETCHING}
      />
    </Container>
  )
}

StoreEvents.navigationOptions = () => ({
  title: 'Events',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(StoreEvents)
