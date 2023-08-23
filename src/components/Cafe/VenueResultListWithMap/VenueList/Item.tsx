import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { NavigationActions } from 'react-navigation'
import { convertDistance, getDistance } from 'geolib'
import { createStructuredSelector } from 'reselect'

import Button from 'src/controls/Button'
import FavoriteStoreIcon from 'src/components/MyBnStore/FavoriteStoreIcon'

import { CafeVenue } from 'src/models/CafeModel/VenueModel'
import { PositionRegion } from 'src/models/MapModel'
import { reset, Routes } from 'src/helpers/navigationService'

import { checkInVenueAction } from 'src/redux/actions/cafe/checkInAction'
import { favoriteStoreIdSelector } from 'src/redux/selectors/myBn/storeSelector'
import {
  addEventAction,
  LL_CHOOSE_CAFE_STORE,
} from 'src/redux/actions/localytics'

const Container = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
`

const StoreContainer = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

interface DescriptionTextProps {
  marginBottom?: boolean
}

const DescriptionText = styled.Text<DescriptionTextProps>`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme, marginBottom }) =>
    marginBottom ? `margin-bottom: ${theme.spacing(1)};` : ''}
`
const ButtonContainer = styled.View`
  justify-content: flex-end;
`

const StartOrderButton = styled(Button)`
  padding-vertical: ${({ theme }) => theme.spacing(1) / 2};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  currentPosition: PositionRegion
  venue: CafeVenue
  onPress: () => void
}

interface StateProps {
  favoriteStoreId?: string
}

interface DispatchProps {
  checkInVenue: (venueId: string) => boolean
  addEvent: (name, attributes) => void
}

const selector = createStructuredSelector({
  favoriteStoreId: favoriteStoreIdSelector,
})

const dispatcher = (dispatch) => ({
  checkInVenue: (venueId) => dispatch(checkInVenueAction(venueId)),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const connector = connect<{}, DispatchProps, OwnProps>(selector, dispatcher)

type Props = DispatchProps & OwnProps & StateProps

const VenueListItem = ({
  venue,
  checkInVenue,
  currentPosition,
  onPress,
  favoriteStoreId,
  addEvent,
}: Props) => {
  const startOrder = useCallback(async () => {
    const success = await checkInVenue(venue.id)
    if (success) {
      reset(1, [
        NavigationActions.navigate({ routeName: Routes.CAFE__MAIN }),
        NavigationActions.navigate({ routeName: Routes.CAFE__CATEGORIES }),
      ])
      const chooseCafeStore = {
        storeName: venue.name,
        city: venue.city,
        state: venue.state,
        favorite: venue.storeId === favoriteStoreId ? 'yes' : 'no',
      }
      addEvent(LL_CHOOSE_CAFE_STORE, chooseCafeStore)
    }
  }, [venue])

  return (
    <Container onPress={onPress}>
      <FavoriteStoreIcon storeId={venue.storeId} />
      <StoreContainer>
        <NameText>{venue.name}</NameText>
        <DescriptionText marginBottom>
          {`${convertDistance(
            getDistance(currentPosition, {
              latitude: venue.latitude,
              longitude: venue.longitude,
            }),
            'mi',
          ).toFixed(1)} miles away`}
        </DescriptionText>
        <DescriptionText>{venue.address}</DescriptionText>
        <DescriptionText>
          {`${venue.city}, ${venue.state} ${venue.zip}`}
        </DescriptionText>
      </StoreContainer>
      <ButtonContainer>
        <StartOrderButton
          disabled={!venue.isOpen}
          onPress={startOrder}
          variant="contained"
          size="small"
        >
          Start order
        </StartOrderButton>
      </ButtonContainer>
    </Container>
  )
}

export default connector(VenueListItem)
