import React, { useState, useEffect, useCallback } from 'react'
import { Keyboard, PermissionsAndroid, Platform } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import Geolocation from 'react-native-geolocation-service'
import { debounce } from 'lodash'

import Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'

import SearchHeader from 'src/components/Search/SearchLocationHeader'
import StoreSearchResult from 'src/components/MyBnStore/SearchStore'
import _SearchSuggestions from 'src/components/MyBnStore/SearchStore/SearchSuggestionsDropdown'

import { PositionRegion } from 'src/models/MapModel'
import {
  StoreSearchSuggestions,
  BopisSearch,
} from 'src/models/StoreModel/SearchModel'
import {
  searchStoreWithQueryAction,
  searchStoreWithLocationAction,
  SearchStoreWithLocationActionParams,
  storeSearchSuggestionsAction,
} from 'src/redux/actions/store/search'
import { shouldRefreshStoreSearchSelector } from 'src/redux/selectors/apiStatus/store'
import { permissionDeniedAction } from 'src/redux/actions/permissions/request'
import { BopisGenerateUserLocationGeoKeyParams } from 'src/endpoints/bopis/userLocation'

const Wrapper = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 1;
`

const SearchSuggestions = styled(_SearchSuggestions)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 1;
`
const SUGGESTIONS_DEBOUNCE_DELAY = 500

interface StateProps {
  shouldRefreshStoreSearch: boolean
}

const selector = createStructuredSelector({
  shouldRefreshStoreSearch: shouldRefreshStoreSearchSelector,
})

interface DispatchProps {
  searchStoreWithQuery: (query: string) => void
  searchStoreWithLocation: (params: SearchStoreWithLocationActionParams) => {}
  storeSearchSuggestions: (query: string) => StoreSearchSuggestions | undefined
  locationPermissionDenied: () => void
}

const dispatcher = (dispatch) => ({
  searchStoreWithQuery: (query) => dispatch(searchStoreWithQueryAction(query)),
  searchStoreWithLocation: (params) =>
    dispatch(searchStoreWithLocationAction(params)),
  storeSearchSuggestions: (query) =>
    dispatch(storeSearchSuggestionsAction(query)),
  locationPermissionDenied: () =>
    dispatch(permissionDeniedAction('locationStore')),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const StoreSearchStore = ({
  searchStoreWithQuery,
  searchStoreWithLocation,
  storeSearchSuggestions,
  shouldRefreshStoreSearch,
  locationPermissionDenied,
}: Props) => {
  const [userLocationState, setUserLocationState] = useState<
    PositionRegion | undefined
  >(undefined)
  const [isSearchingNearbyState, setIsSearchingNearbyState] = useState<boolean>(
    true,
  )
  const [searchSuggestionsState, setSearchSuggestionsState] = useState<
    StoreSearchSuggestions | undefined
  >(undefined)
  const [isPreviousSearchState, setIsPreviousSearchState] = useState<boolean>(
    !shouldRefreshStoreSearch,
  )
  const [queryState, setQueryState] = useState<string>('')
  const [keyboardVisible, setKeyboardVisible] = useState({
    visible: false,
    height: 0,
  })

  const getSearchSuggestions = useCallback(
    async (value: string) => {
      setQueryState(value)
      if (!value || !value.length) {
        setSearchSuggestionsState(undefined)
        onReset()
        return
      }
      const searchSuggestions = await storeSearchSuggestions(value)
      if (/^\d+$/.test(value) && value.length === 5) {
        // is 5 digit zip code case
        setSearchSuggestionsState({
          zip: [{ term: value, bopisQuery: value }],
        })
      } else if (searchSuggestions) {
        setSearchSuggestionsState(searchSuggestions)
      }
    },
    [userLocationState],
  )

  const onSearch = useCallback((bopisSearch: BopisSearch) => {
    setIsPreviousSearchState(false)
    setQueryState(bopisSearch.term)
    setSearchSuggestionsState(undefined)
    Keyboard.dismiss()
    setIsSearchingNearbyState(false)
    searchStoreWithQuery(bopisSearch.bopisQuery)
  }, [])

  const onSearchLocation = useCallback((position: PositionRegion) => {
    setIsPreviousSearchState(false)
    setIsSearchingNearbyState(false)
    setQueryState('')
    setSearchSuggestionsState(undefined)
    Keyboard.dismiss()
    setUserLocationState({
      latitude: position.latitude,
      longitude: position.longitude,
    })
  }, [])

  const onReset = useCallback(
    (isCancel = false) => {
      setQueryState('')
      setSearchSuggestionsState(undefined)
      if (!isCancel) {
        setIsSearchingNearbyState(true)
        searchStoreWithLocation(
          userLocationState as BopisGenerateUserLocationGeoKeyParams,
        )
      }
    },
    [userLocationState],
  )

  useEffect(() => {
    if (userLocationState && !isPreviousSearchState) {
      searchStoreWithLocation(userLocationState)
    }
  }, [userLocationState])

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow)
    Keyboard.addListener('keyboardDidHide', keyboardDidHide)

    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide)
    }
  }, [])

  const keyboardDidShow = (e) => {
    setKeyboardVisible({ visible: true, height: e.endCoordinates.height })
  }

  const keyboardDidHide = () => {
    setKeyboardVisible({ visible: false, height: 0 })
    setIsPreviousSearchState(true)
  }

  const hasLocationPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const statusPermissionIOS = await Geolocation.requestAuthorization(
        'whenInUse',
      )
      if (statusPermissionIOS === 'granted') {
        return true
      }
      return false
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )

    if (hasPermission) {
      return true
    }

    const statusPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )

    if (statusPermission === PermissionsAndroid.RESULTS.GRANTED) {
      return true
    }

    return false
  }, [])

  const getCurrentPosition = useCallback(async () => {
    const hasPermission = await hasLocationPermission()

    if (!hasPermission) {
      return
    }

    Geolocation.getCurrentPosition((position) => {
      setUserLocationState({
        latitude: position.coords.latitude || 0,
        longitude: position.coords.longitude || 0,
      })
    })
  }, [])

  useEffect(() => {
    getCurrentPosition()
  }, [])

  return (
    <Container>
      <Wrapper>
        <StoreSearchResult
          isSearchingNearby={isSearchingNearbyState}
          userLocation={userLocationState}
          isPreviousSearchState={isPreviousSearchState}
        />
        {keyboardVisible.visible && (
          <SearchSuggestions
            keyboardHeight={keyboardVisible.height}
            style={{ paddingTop: 50 }}
            searchSuggestions={searchSuggestionsState}
            onSearch={onSearch}
            showNoResults={true}
          />
        )}
      </Wrapper>
      <SearchHeader
        value={queryState}
        onValueChange={debounce(
          getSearchSuggestions,
          SUGGESTIONS_DEBOUNCE_DELAY,
        )}
        onPressCurrentLocation={onSearchLocation}
        onReset={onReset}
      />
    </Container>
  )
}

StoreSearchStore.navigationOptions = () => ({
  title: 'Store',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(StoreSearchStore)
