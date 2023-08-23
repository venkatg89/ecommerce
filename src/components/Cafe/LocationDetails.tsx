import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import MapView, { Marker } from 'react-native-maps'

import { CafeVenue } from 'src/models/CafeModel/VenueModel'

import formatPhoneNumber from 'src/helpers/formatPhoneNumber'
import { icons } from 'assets/images'

import { venueFromIdSelector } from 'src/redux/selectors/cafeSelector'
import { favoriteStoreIdSelector } from 'src/redux/selectors/myBn/storeSelector'

const Container = styled.View``

const Flex = styled.View`
  flex-direction: row;
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.heading3}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const Column = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
`

const Spacer = styled.View`
  width: 20;
`

const DetailsText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

interface OwnProps {
  style?: any
  withName?: boolean
}

interface StateProps {
  venue: CafeVenue // venue should be populated at this state
  favoriteStoreId: string
}

const selector = createStructuredSelector({
  venue: (state, ownProps) => {
    const { venueId } = ownProps
    return venueFromIdSelector(state, { venueId })
  },
  favoriteStoreId: favoriteStoreIdSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const CartItems = ({ style, venue, withName, favoriteStoreId }: Props) => (
  <Container style={style}>
    {venue && (
      <React.Fragment>
        {withName && <NameText>{venue.name}</NameText>}
        <Flex>
          <Column>
            <DetailsText numberOfLines={1}>{venue.address}</DetailsText>
            <DetailsText>{`${venue.city}, ${venue.state} ${venue.zip}`}</DetailsText>
            <DetailsText>{formatPhoneNumber(venue.phone)}</DetailsText>
          </Column>
          <Spacer />
          <Column>
            <MapView
              style={{ width: '100%', flex: 1, height: 88 }}
              region={{
                latitude: venue.latitude,
                longitude: venue.longitude,
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              <Marker
                coordinate={{
                  latitude: venue.latitude,
                  longitude: venue.longitude,
                }}
                title={venue.name}
                description={venue.description}
                image={
                  favoriteStoreId === venue.storeId
                    ? icons.pinMapFavorite
                    : icons.pinMap
                }
              />
            </MapView>
          </Column>
        </Flex>
      </React.Fragment>
    )}
  </Container>
)

export default connector(CartItems)
