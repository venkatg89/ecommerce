import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { Keyboard, Dimensions } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import DeviceInfo from 'react-native-device-info'

import { StoreModel } from 'src/models/StoreModel'
import { PositionRegion } from 'src/models/MapModel'
import { navigate, Routes, Params } from 'src/helpers/navigationService'
import { useResponsiveDimensions } from 'src/constants/layout'
import { icons } from 'assets/images'

const INITIAL_DELTA = {
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
  latitude: 0,
  longitude: 0,
}

const navBarAndHeaderHeight = 128
export const searchBarHeight = DeviceInfo.isTablet() ? 0 : 74
const statusBarHeight = 20 // 44 for iPhone X

interface Props {
  stores: StoreModel[]
  favoriteStore?: StoreModel
  centerPosition?: PositionRegion
  isSearchingNearby: boolean
  stack?: string
  halfScreen?: boolean
}

const StoreMap = ({
  stores,
  centerPosition,
  isSearchingNearby,
  favoriteStore,
  stack,
  halfScreen = false,
}: Props) => {
  const { width, height } = useResponsiveDimensions()
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (centerPosition) {
      setTimeout(() => mapRef.current.animateToRegion({
        ...INITIAL_DELTA,
        ...centerPosition,
      }), 10)
    }
  }, [centerPosition])

  useEffect(() => {
    if (isSearchingNearby) {
      try {
        mapRef.current.fitToSuppliedMarkers(
          stores.map((store) => store.id),
          false,
        )
      } catch (error) {
        /**/
      }
    }
  }, [stores[0], isSearchingNearby])

  const mapHeight = halfScreen ? Dimensions.get('screen').height / 2.6 : (height - navBarAndHeaderHeight - searchBarHeight - statusBarHeight)
  const mapStyle = useMemo(
    () => ({
      aspectRatio:
        width / mapHeight,
    }),
    [height, width],
  )

  const coordinate = useCallback(
    (store) => ({
      latitude: store.latitude,
      longitude: store.longitude,
    }),
    [],
  )

  const handlePress = useCallback((store) => {
    //default params
    const navParams = {
      [Params.STORE_ID]: store.id,
      [Params.STORE_NAME]: store.name,
    }
    //default destination
    let destination = Routes.MY_BN__STORE_DETAILS

    switch (stack) {
      case Routes.CART_TAB: {
        navParams[Params.STACK] = Routes.CART_TAB
        destination = Routes.CART__STORE_DETAILS
        break
      }
      default: {
        //nothing to do here yet
        break
      }
    }

    navigate(destination, navParams)
  }, [])

  const isFavoriteStore =
    favoriteStore &&
    stores.some((store) => store.id === favoriteStore.id) === false

  return (
    <MapView
      ref={mapRef}
      style={mapStyle}
      onPress={Keyboard.dismiss}
      showsUserLocation
    >
      {stores.map((store) =>
        store.latitude ? (
          <Marker
            key={store.id}
            title={store.name}
            identifier={store.id}
            coordinate={coordinate(store)}
            onCalloutPress={() => handlePress(store)}
            image={
              favoriteStore && favoriteStore.id === store.id
                ? icons.pinMapFavorite
                : icons.pinMap
            }
          />
        ) : null,
      )}

      {favoriteStore && isFavoriteStore && (
        <Marker
          key={favoriteStore.id}
          title={favoriteStore.name}
          identifier={favoriteStore.id}
          coordinate={coordinate(favoriteStore)}
          onCalloutPress={() => handlePress(favoriteStore)}
          image={icons.pinMapFavorite}
        />
      )}
    </MapView>
  )
}

export default StoreMap
