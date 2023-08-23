import React, { useCallback } from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import * as AddCalendarEvent from 'react-native-add-calendar-event'
import moment from 'moment'
import styled from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Header from 'src/controls/navigation/Header'
import Button from 'src/controls/Button'

import ScreenHeader from 'src/components/ScreenHeader'
import EventCtaButton  from 'src/components/CtaButtons/EventCtaButton'
import BookImage from 'src/components/BookImage'

import { EventModel, StoreModel } from 'src/models/StoreModel'
import { Params } from 'src/constants/routes'
import { toWeekdayCommaDayMonthCommaTime } from 'src/helpers/dateFormatters'

import { permissionDeniedAction } from 'src/redux/actions/permissions/request'
import { getEventByIdSelector, getStoreByEventIdSelector } from 'src/redux/selectors/myBn/storeSelector' // maybe eventSelector?
import { EVENT_DATE_FORMAT } from '../../constants/dateConstants'

const Date = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(3)};
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const Description = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey2};
`

const BookImageContainer = styled.View`
  align-self: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const AddToCalenderButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  padding-right: ${({ theme }) => theme.spacing(4)};
  padding-left: ${({ theme }) => theme.spacing(4)};
`

interface StateProps {
  event: EventModel;
  store: StoreModel;
}

const selector = createStructuredSelector({
  event: (state, ownProps) => {
    const eventId = ownProps.navigation.getParam(Params.EVENT_ID)
    return getEventByIdSelector(state, { eventId })
  },
  store: (state, ownProps) => {
    const eventId = ownProps.navigation.getParam(Params.EVENT_ID)
    return getStoreByEventIdSelector(state, { eventId })
  },
})

interface DispatchProps {
  calendarPermissionDenied: () => void;
}

const dispatcher = dispatch => ({
  calendarPermissionDenied: () => dispatch(permissionDeniedAction('calendar')),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const EventDetailsScreen = ({ event, store, calendarPermissionDenied }: Props) => {
  const addToCalendar = useCallback(async () => {
    const config = {
      title: event.name,
      notes: event.description,
      startDate: moment(event.date).format(EVENT_DATE_FORMAT),
      endDate: moment(event.date).add(2, 'hours').format(EVENT_DATE_FORMAT),
      location: `${store.address} ${store.city}, ${store.state}`,
    }
    try {
      await AddCalendarEvent.presentEventCreatingDialog(config)
    } catch (error) {
      if (error === 'permissionNotGranted') {
        calendarPermissionDenied()
      }
    }
  }, [event, store])

  return (
    <Container>
      <ScrollContainer>
        <ScreenHeader
          header={ event.name }
          body={ event.types }
        />
        <Date accessibilityLabel={ `, ${toWeekdayCommaDayMonthCommaTime(event.date)}, ` }>
          { `${toWeekdayCommaDayMonthCommaTime(event.date)}` }
        </Date>
        <Description>
          { event.description }
        </Description>
        { event.eans[0] && (
          <BookImageContainer>
            <BookImage
              bookOrEan={ event.eans[0] }
              size="large"
            />
          </BookImageContainer>
        ) }
        <AddToCalenderButton variant="contained" center onPress={ addToCalendar }>
          Add to Calendar
        </AddToCalenderButton>
      </ScrollContainer>
    </Container>
  )
}

EventDetailsScreen.navigationOptions = ({ navigation }) => {
  const eventId = navigation.getParam(Params.EVENT_ID)
  return ({
    header: headerProps => (
      <Header
        headerProps={ headerProps }
        ctaComponent={ <EventCtaButton eventId={ eventId } /> }
      />
    ),
  })
}

export default connector(EventDetailsScreen)
