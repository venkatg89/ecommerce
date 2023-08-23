import React, { useEffect, useState, useCallback } from 'react'
import { Keyboard } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import MapView, { Region, Marker } from 'react-native-maps'
import { CafeVenue } from 'src/models/CafeModel/VenueModel'
import { PositionRegion } from 'src/models/MapModel'
import { navigate, Routes, Params } from 'src/helpers/navigationService'
import { icons } from 'assets/images'

import {
  cafeSearchVenueResultListSelector,
  favoriteCafeVenueSelector,
} from 'src/redux/selectors/listings/cafeSelector'

const INITIAL_DELTA = {
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
}

const style = {
  map: {
    flex: 1,
  },
}
interface OwnProps {
  focusedPosition: PositionRegion
}

interface StateProps {
  nearbyVenueList: CafeVenue[]
  favoriteStore?: CafeVenue
}

const selector = createStructuredSelector({
  nearbyVenueList: cafeSearchVenueResultListSelector,
  favoriteStore: favoriteCafeVenueSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const VenueMap = ({
  focusedPosition,
  nearbyVenueList,
  favoriteStore,
}: Props) => {
  const [region, setRegion] = useState<Region>({
    ...focusedPosition,
    ...INITIAL_DELTA,
  })

  useEffect(() => {
    // if we manually set the region (clicking venue or current location), we update the state on the
    // parent component and we get a new object refence. we take advantage of this by preventing the
    // map from updating to the manually set region when the reference is the same (no new region set).
    // if a new region is set, we get a new reference and we compare with the current map position and
    // if the region is difference, set the map to the new region
    setRegion({
      ...focusedPosition,
      ...INITIAL_DELTA,
    })
  }, [focusedPosition])

  const coordinate = useCallback(
    (venue) => ({
      latitude: venue.latitude,
      longitude: venue.longitude,
    }),
    [],
  )

  const handlePress = useCallback((venue) => {
    navigate(Routes.CAFE__STORE_DETAILS, {
      [Params.STORE_ID]: venue.storeId,
      [Params.STORE_NAME]: venue.name,
    })
  }, [])

  return (
    <MapView
      style={style.map}
      region={region}
      onPress={Keyboard.dismiss}
      showsUserLocation
    >
      {nearbyVenueList.map((venue) => (
        <Marker
          key={venue.id}
          coordinate={coordinate(venue)}
          title={venue.name}
          description={venue.description}
          onCalloutPress={() => handlePress(venue)}
          image={
            favoriteStore && favoriteStore.id === venue.id
              ? icons.pinMapFavorite
              : icons.pinMap
          }
        />
      ))}
    </MapView>
  )
}

export default connector(VenueMap)
