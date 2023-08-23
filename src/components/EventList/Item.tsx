import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import CtaButton from 'src/controls/navigation/CtaButton'
import Button from 'src/controls/Button/CtaButton'
import { makeEventURLFull } from 'src/helpers/generateUrl'
import Share from 'react-native-share'
import { icons } from 'assets/images'

import DraggableModal from 'src/controls/Modal/BottomDraggable'
import { toWeekdayCommaDayMonthCommaTime } from 'src/helpers/dateFormatters'
import { navigate } from 'src/helpers/navigationService'
import Routes, { Params } from 'src/constants/routes'
import { EventModel, StoreModel } from 'src/models/StoreModel'
import {
  getEventByIdSelector,
  getStoreByEventIdSelector,
} from 'src/redux/selectors/myBn/storeSelector'

import moment from 'moment'
import * as AddCalendarEvent from 'react-native-add-calendar-event'
import { permissionDeniedAction } from 'src/redux/actions/permissions/request'

import {
  addEventAction,
  LL_STORE_EVENT_VIEWED,
} from 'src/redux/actions/localytics'

const Container = styled.View`
  flex-direction: column;
`

const Row = styled.View`
  flex-direction: row;
  align-items: flex-end;
`

const Column = styled.TouchableOpacity`
  flex-direction: column;
  flex: 1;
`
interface TextProps {
  gutterBottom?: boolean
}

const Text = styled.Text<TextProps>`
  margin-bottom: ${({ theme, gutterBottom }) =>
    gutterBottom ? theme.spacing(1) : 0};
`

const Title = styled(Text)`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
`

const EventDate = styled(Text)`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey2};
`

const Details = styled(Text)`
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme }) => theme.typography.body2};
`
interface OwnProps {
  // eslint-disable-next-line react/no-unused-prop-types
  eventId: string
  stack?: string
}

interface StateProps {
  event: EventModel
  store: StoreModel
}

interface DispatchProps {
  calendarPermissionDenied: () => void
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  calendarPermissionDenied: () => dispatch(permissionDeniedAction('calendar')),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const selector = createStructuredSelector({
  event: (state, ownProps) => {
    const { eventId } = ownProps
    return getEventByIdSelector(state, { eventId })
  },
  store: (state, ownProps) => {
    const { eventId } = ownProps
    return getStoreByEventIdSelector(state, { eventId })
  },
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps

const EventCard = ({
  event,
  store,
  calendarPermissionDenied,
  stack,
  addEvent,
}: Props) => {
  const navigateToEvent = useCallback(() => {
    //default destination
    let destination = Routes.MY_BN__EVENT_DETAILS
    switch (stack) {
      case Routes.CAFE_TAB: {
        destination = Routes.CAFE__EVENT_DETAILS
        break
      }
      case Routes.CART_TAB: {
        destination = Routes.CART__EVENT_DETAILS
        break
      }
      default: {
        //nothing to do here yet
        break
      }
    }

    const storeEventViewed = {
      eventName: event.name,
      city: store.city,
      state: store.state,
    }

    addEvent(LL_STORE_EVENT_VIEWED, storeEventViewed)
    navigate(destination, { [Params.EVENT_ID]: event.id })
  }, [])
  const [isOpen, setOpen] = useState<boolean>(false)
  const toggleModal = useCallback(() => setOpen(!isOpen), [isOpen])

  const handleClickShare = async () => {
    const eventUrl = makeEventURLFull(event.id)
    const options = {
      title: 'Share via',
      url: eventUrl,
      social: Share.Social.EMAIL,
    }
    try {
      await Share.open(options)
      toggleModal()
    } catch {
      toggleModal()
    }
  }

  const addToCalendar = useCallback(async () => {
    const config = {
      title: event.name,
      notes: event.description,
      startDate: moment(event.date).toJSON(),
      endDate: moment(event.date).add(2, 'hours').toJSON(),
      location: `${store.address} ${store.city}, ${store.state}`,
    }
    try {
      await AddCalendarEvent.presentEventCreatingDialog(config)
      toggleModal()
    } catch (error) {
      if (error === 'permissionNotGranted') {
        calendarPermissionDenied()
      }
      toggleModal()
    }
  }, [event, store, isOpen])

  return (
    <Container>
      <Row>
        <Column onPress={navigateToEvent}>
          <Title gutterBottom>{event.name}</Title>
          <EventDate
            accessibilityLabel={`, ${toWeekdayCommaDayMonthCommaTime(
              event.date,
            )},`}
            gutterBottom
          >
            {`${toWeekdayCommaDayMonthCommaTime(event.date)}`}
          </EventDate>
          {event.types.length > 0 && (
            <Details gutterBottom>{event.types}</Details>
          )}
        </Column>

        <CtaButton dots onPress={toggleModal} accessibilityLabel="three dots" />
      </Row>
      <DraggableModal isOpen={isOpen} onDismiss={toggleModal}>
        <Button
          icon={icons.calendar}
          label="Add to Calendar"
          onPress={addToCalendar}
        />
        <Button icon={icons.share} label="Share" onPress={handleClickShare} />
      </DraggableModal>
    </Container>
  )
}

export default connector(EventCard)
